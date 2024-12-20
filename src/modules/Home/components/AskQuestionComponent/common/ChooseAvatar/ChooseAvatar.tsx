import styles from "./ChooseAvatar.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FC, useState, useEffect, useContext } from "react";
import Button from "../../../../../../components/common/Buttons/Button";
import { UserContext } from "../../../../../../core/contexts";

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
  setSelectedAvatar: (link: string) => void;
  setUserAvatar: (id: number) => void;
}

const ChooseAvatar: FC<ChooseAvatarProps> = ({
  setCurrentStep,
  avatars = { data: [] },
  setSelectedAvatar,
  setUserAvatar,
}) => {
  const value = useContext(UserContext); // Assuming the context provides user data
  const defaultAvatarId = value?.avatarSettings?.id || 1;
  const [currentImage, setCurrentImage] = useState<AvatarData | null>(null);
  const [initialSlide, setInitialSlide] = useState<number>(0);

  useEffect(() => {
    if (avatars?.data?.length) {
      // Find the avatar with the ID from avatarSettings or fall back to the first avatar
      const initialAvatarIndex = avatars.data.findIndex(
        (avatar) => avatar.id === defaultAvatarId
      );
      const foundIndex = initialAvatarIndex !== -1 ? initialAvatarIndex : 0;
      setInitialSlide(foundIndex);

      const initialAvatar = avatars.data[foundIndex];
      setCurrentImage(initialAvatar);
      setSelectedAvatar(initialAvatar.avatarPicture.link);
    }
  }, [avatars, defaultAvatarId, setSelectedAvatar]);

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
    initialSlide: initialSlide, // Set the initial slide dynamically
    afterChange: (current: number) => {
      if (avatars?.data?.length) {
        const selected = avatars.data[current % avatars.data.length];
        setCurrentImage(selected);
        setSelectedAvatar(selected.avatarPicture.link);
      }
    },
  };

  if (!currentImage) return <div>Loading avatars...</div>;

  const handleNextStep = () => {
    setCurrentStep(2);
    setUserAvatar(currentImage.id);
  };

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
          onClick={handleNextStep}
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
