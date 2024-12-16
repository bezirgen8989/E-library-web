import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";

// @ts-ignore
import { PlayerStatus } from "@constants";

import { defaultVideoOptions, getIdFromUrl } from "./helpers";
import { SrsRtcWhipWhepAsync } from "./srs/srs.sdk";
import styles from "./styles.module.scss";

export interface SrsWhepPlayerProps {
  url: string;
  options?: React.VideoHTMLAttributes<HTMLVideoElement>;
  rtcOpts?: any;
  width: number;
  height: number;
  classname?: string;
  reductionFactor: number;
  coordinates: { x: number; y: number };
  videoRef: React.MutableRefObject<any>;

  setCoordinates: (coordinates: { x: number; y: number }) => void;
  savedCoordinatesCallback: (x: number, y: number) => void;
  handlePlay: () => void;
}

export const SrsPlayer: React.FC<SrsWhepPlayerProps> = ({
  url,
  options,
  rtcOpts,
  width,
  height,
  classname,
  reductionFactor,
  setCoordinates,
  savedCoordinatesCallback,
  videoRef,
  handlePlay,
}) => {
  const videoOptions = {
    ...defaultVideoOptions,
    ...options,
  };
  const srsSdkRef = useRef<typeof SrsRtcWhipWhepAsync | any>(null);

  const id = getIdFromUrl(url);
  const [status, setStatus] = useState(PlayerStatus.Loading);

  const startPlay = async () => {
    // eslint-disable-next-line
    // @ts-ignore
    srsSdkRef.current = new SrsRtcWhipWhepAsync();
    try {
      await srsSdkRef.current.play(url, rtcOpts);
      setStatus(PlayerStatus.Playing);

      if (videoRef.current) {
        videoRef.current.srcObject = srsSdkRef.current.stream;
        handlePlay();
      }
    } catch (e) {
      console.error(`SrsWhepPlayer error happens on ${id}`, e);
      setStatus(PlayerStatus.Loading);
    }
  };

  const cleanup = () => {
    if (srsSdkRef.current) {
      srsSdkRef.current.close();
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const rect = videoRef.current.getBoundingClientRect();
    const videoWidth = videoRef.current.clientWidth;
    const videoHeight = videoRef.current.clientHeight;

    let x = ((e.clientX - rect.left) / videoWidth) * width;
    let y = ((e.clientY - rect.top) / videoHeight) * height;

    if (x > width) {
      x = width;
    }

    if (x < 0) {
      x = 0;
    }

    if (y > height) {
      y = height;
    }

    if (y < 0) {
      y = 0;
    }

    savedCoordinatesCallback(+x.toFixed(), +y.toFixed());
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLVideoElement>) => {
    const rect = videoRef.current.getBoundingClientRect();
    const videoWidth = videoRef.current.clientWidth;
    const videoHeight = videoRef.current.clientHeight;

    let x = ((e.clientX - rect.left) / videoWidth) * width;
    let y = ((e.clientY - rect.top) / videoHeight) * height;

    if (x > width) {
      x = width;
    }

    if (x < 0) {
      x = 0;
    }

    if (y > height) {
      y = height;
    }

    if (y < 0) {
      y = 0;
    }

    setCoordinates({ x, y });
  };

  useEffect(() => {
    startPlay();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, status]);

  const displayedWidth = width / reductionFactor;
  const displayedHeight = height / reductionFactor;

  return (
    <div className={styles.player_container}>
      {status === PlayerStatus.Loading ? (
        <div className={styles.player_mask}>
          <span>Loading...</span>
        </div>
      ) : (
        <video
          className={cn(classname, styles.player_video)}
          ref={videoRef}
          onClick={handleVideoClick}
          onMouseMove={handleMouseMove}
          style={{
            width: `${displayedWidth}px`,
            height: `${displayedHeight}px`,
          }}
          {...videoOptions}
          controls={false}
        />
      )}
    </div>
  );
};
