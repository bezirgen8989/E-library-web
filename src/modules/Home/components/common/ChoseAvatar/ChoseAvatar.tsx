import styles from "./ChoseAvatar.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Avatar from "../../../../../assets/images/tempAvatar.png";
import Avatar2 from "../../../../../assets/images/tempAvatar2.png";
import Avatar3 from "../../../../../assets/images/tempAvatar3.png";
import { useState } from "react";

const avatars = [
  { avatar: Avatar, name: "Umar" },
  { avatar: Avatar2, name: "Kevin" },
  { avatar: Avatar3, name: "Li" },
  { avatar: Avatar, name: "Umar" },
  { avatar: Avatar2, name: "Kevin" },
  { avatar: Avatar3, name: "Li" },
];

const ChoseAvatar = () => {
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
    afterChange: (current: any) => {
      setCurrentImage(avatars[current % avatars.length]); // Update the background image based on the current slide
    },
  };

  return (
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
    </div>
  );
};

export default ChoseAvatar;
