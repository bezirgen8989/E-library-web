import styles from "./ChooseAvatar.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Avatar from "../../../../../../assets/images/tempAvatar.png";
import Avatar2 from "../../../../../../assets/images/tempAvatar2.png";
import Avatar3 from "../../../../../../assets/images/tempAvatar3.png";
import { FC, useState } from "react";
import Button from "../../../../../../components/common/Buttons/Button";

const avatars = [
  { avatar: Avatar, name: "Umar", id: "1" },
  { avatar: Avatar2, name: "Kevin", id: "2" },
  { avatar: Avatar3, name: "Li", id: "3" },
  { avatar: Avatar, name: "Umar", id: "4" },
  { avatar: Avatar2, name: "Kevin", id: "5" },
  { avatar: Avatar3, name: "Li", id: "6" },
];

interface ChooseAvatar {
  setCurrentStep: (value: number) => void;
}

const ChooseAvatar: FC<ChooseAvatar> = ({ setCurrentStep }) => {
  const [currentImage, setCurrentImage] = useState(avatars[0]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Show five slides at a time
    slidesToScroll: 1, // Scroll one slide at a time
    nextArrow: <button className="slick-next">Next</button>, // Next button
    prevArrow: <button className="slick-prev">Previous</button>, // Previous button
    centerMode: true, // Center the active slide
    focusOnSelect: true, // Allow selecting the center slide
    centerPadding: "0", // Remove padding from sides of active slide
    afterChange: (current: number) => {
      setCurrentImage(avatars[current % avatars.length]); // Update the current avatar based on the active slide
    },
  };

  return (
    <div className={styles.askQuestionAvatar}>
      <div className={styles.avatarSliderWrap}>
        <div
          className={styles.sliderBackground}
          style={{ backgroundImage: `url(${currentImage.avatar})` }}
        ></div>
        <Slider {...settings} className="avatarCarousel">
          {avatars.map((avatar, index) => (
            <div className="slideItem" key={index}>
              <div>
                <img src={avatar.avatar} alt={`Avatar ${index + 1}`} />
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
          onClick={() => {
            setCurrentStep(2);
          }}
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
