import styles from "./ChooseAvatar.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FC, useState, useEffect } from "react";
import Button from "../../../../../../components/common/Buttons/Button";

interface AvatarData {
  id: number;
  name: string;
  avatarMiniature: {
    link: string;
  };
  avatarPicture: {
    link: string;
  };
}

interface ChooseAvatarProps {
  setCurrentStep: (value: number) => void;
  avatars: { data: AvatarData[] };
  setSelectedAvatar: (link: string) => void; // Новая функция для установки выбранного аватара
}

const ChooseAvatar: FC<ChooseAvatarProps> = ({
  setCurrentStep,
  avatars = { data: [] },
  setSelectedAvatar,
}) => {
  const [currentImage, setCurrentImage] = useState<AvatarData | null>(null);

  useEffect(() => {
    if (avatars?.data?.length) {
      setCurrentImage(avatars.data[0]);
      setSelectedAvatar(avatars.data[0].avatarPicture.link); // Устанавливаем начальный аватар
    }
  }, [avatars, setSelectedAvatar]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <button className="slick-next">Next</button>,
    prevArrow: <button className="slick-prev">Previous</button>,
    centerMode: true,
    focusOnSelect: true,
    centerPadding: "0",
    afterChange: (current: number) => {
      if (avatars?.data?.length) {
        const selected = avatars.data[current % avatars.data.length];
        setCurrentImage(selected);
        setSelectedAvatar(selected.avatarPicture.link); // Обновляем выбранный аватар
      }
    },
  };

  if (!currentImage) return <div>Loading avatars...</div>;

  return (
    <div className={styles.askQuestionAvatar}>
      <div className={styles.avatarSliderWrap}>
        <div
          className={styles.sliderBackground}
          style={{ backgroundImage: `url(${currentImage.avatarPicture.link})` }}
        ></div>
        <Slider {...settings} className="avatarCarousel">
          {avatars.data.map((avatar) => (
            <div className="slideItem" key={avatar.id}>
              <div>
                <img src={avatar.avatarMiniature.link} alt={avatar.name} />
                <div className="avatarName">{avatar.name}</div>
              </div>
            </div>
          ))}
        </Slider>
        <div className={styles.gratisBlock}>
          Hi! I'm your assistant in the
          <br /> magic world of books.
        </div>
        <div className={styles.subTitle}>
          Please choose how I will look like.
        </div>
        <Button
          onClick={() => setCurrentStep(2)}
          style={{ width: "341px", margin: "20px auto 20px" }}
          variant="Brown"
        >
          Choose {currentImage.name}
        </Button>
      </div>
    </div>
  );
};

export default ChooseAvatar;
