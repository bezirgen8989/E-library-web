import React, { useEffect, useState } from "react";
import { useLazySelector } from "../../../hooks";

import { getAvatars } from "../slices/home";
import Slider, { Settings } from "react-slick";
import styles from "./ChooseAvatarContainer.module.scss";
import { Image } from "antd";
import cn from "classnames";
import { setAvatar, useAuthState } from "../../Auth/slices/auth";
import Button from "../../../components/common/Buttons/Button";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const ChooseAvatarContainer: React.FC = () => {
  const { t } = useTranslation();
  const { avatars } = useLazySelector(({ home }) => ({
    avatars: home.avatars,
  }));
  const { userData } = useAuthState();
  const [currentAvatarInSlider, setCurrentAvatarInSlider] = useState<number>(0);
  const dispatch = useDispatch<any>();
  const { push } = useHistory();

  useEffect(() => {
    if (userData?.result?.avatarSettings?.id) {
      setCurrentAvatarInSlider(userData?.result?.avatarSettings?.id - 1);
    } else {
      setCurrentAvatarInSlider(0);
    }
  }, [userData?.result?.avatarSettings?.id]);

  useEffect(() => {
    dispatch(
      getAvatars({
        limit: "12",
        page: "1",
      })
    );
  }, []);

  const handleSaveSelectedAvatar = async () => {
    if (userData?.result?.avatarSettings?.id !== currentAvatarInSlider + 1) {
      try {
        const result = await dispatch(
          setAvatar({
            avatarSettings: {
              id: currentAvatarInSlider + 1,
            },
          })
        ).unwrap();

        if (result.success) {
          push("/user/profile");
        }
      } catch (err) {
        console.error("Ошибка при сохранении аватара:", err);
      }
    }
  };

  const settings: Settings = {
    infinite: true,
    speed: 250,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    centerPadding: "0",
    lazyLoad: "ondemand",
    initialSlide: currentAvatarInSlider,
    afterChange: (current: number) => {
      setCurrentAvatarInSlider(current);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <div className={styles.wrapperBlock}>
      <div className={styles.avatarBg} />
      <div className={styles.avatarSliderWrap}>
        {!avatars.isLoading && (
          <>
            <Slider {...settings} className="avatarCarousel">
              {avatars?.result?.data?.map((avatar: any, index: number) => (
                <div
                  key={avatar?.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className={cn(styles.askQuestionAvatar, {
                      [styles.hideAnimationBlock]:
                        currentAvatarInSlider !== index,
                    })}
                    style={{
                      visibility:
                        currentAvatarInSlider !== index ? "hidden" : "visible",
                    }}
                  >
                    <Image
                      className={styles.sliderBackground}
                      preview={false}
                      src={avatar.avatarPicture.link}
                      alt={avatar.name}
                    />
                  </div>
                  <div className="slideItem" key={avatar.id}>
                    <div>
                      <img
                        src={avatar.avatarMiniature.link}
                        alt={avatar.name}
                      />
                      <div className="avatarName">{avatar.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
            <div className={styles.gratisBlock}>
              {t("helloAvatar1")}
              <br /> {t("helloAvatar2")}
            </div>
          </>
        )}
        <Button
          style={{ width: "341px", margin: "20px auto 20px" }}
          variant="Brown"
          onClick={handleSaveSelectedAvatar}
        >
          {t("chooseBtn")}{" "}
          {avatars?.result?.data?.[currentAvatarInSlider]?.name}
        </Button>
      </div>
    </div>
  );
};

export default ChooseAvatarContainer;
