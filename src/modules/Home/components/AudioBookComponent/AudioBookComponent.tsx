import React, { useRef, useState } from "react";
import styles from "./AudioBookComponent.module.scss";
import PrevPage from "../../../../assets/images/icons/prevPage.svg";
import BackS from "../../../../assets/images/icons/backS.svg";
import ForwardS from "../../../../assets/images/icons/forwardS.svg";

interface AudioBookComponentProps {
  currentAudioBook: any;
  setCurrentPage: any;
  currentBookVersion: any;
  book: any;
}

const AudioBookComponent: React.FC<AudioBookComponentProps> = ({
  currentAudioBook,
  setCurrentPage,
  currentBookVersion,
  book,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1); // Default speed is 1x

  const handlePrevPage = () => {
    setCurrentPage((prev: string) =>
      parseInt(prev) > 1 ? (parseInt(prev) - 1).toString() : prev
    );
  };

  const handleNextPage = () => {
    setCurrentPage((prev: string) => (parseInt(prev) + 1).toString());
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const toggleSpeed = () => {
    if (audioRef.current) {
      const newSpeed = playbackRate === 1 ? 2 : 1;
      audioRef.current.playbackRate = newSpeed;
      setPlaybackRate(newSpeed);
    }
  };

  return (
    <div className={styles.audio_page_wrap}>
      <button onClick={toggleSpeed} className={styles.speed_button}>
        {playbackRate}x
      </button>
      <div className={styles.audio_page}>
        <div className={styles.absolutEffect} />
        <div className={styles.audio_page_content}>
          <div className={styles.audioImg}>
            <img
              src={currentBookVersion?.result?.data[0]?.locBookCover?.link}
              alt=""
            />
          </div>
          <div className={styles.audioTitle}>
            {currentBookVersion?.result?.data[0]?.title}
          </div>
          <div className={styles.authorTitle}>
            {book?.result?.author[0].name}
          </div>
          <div className={styles.controls}>
            <button onClick={handlePrevPage} className={styles.control_button}>
              <img src={PrevPage} alt="prev" />
            </button>
            <button onClick={skipBackward} className={styles.control_button}>
              <img src={BackS} alt="" />
            </button>
            <button onClick={togglePlay} className={styles.play_button}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={skipForward} className={styles.control_button}>
              <img src={ForwardS} alt="" />
            </button>

            <button onClick={handleNextPage} className={styles.control_button}>
              <img src={PrevPage} alt="prev" className={styles.flipIcon} />
            </button>
          </div>
          <audio
            ref={audioRef}
            src={currentAudioBook?.result?.audioUrl}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioBookComponent;
