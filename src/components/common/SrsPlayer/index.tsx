import React, { useEffect, useRef, useState } from "react";
// import cn from "classnames";

import { defaultVideoOptions, getIdFromUrl } from "./helpers";
import { SrsRtcWhipWhepAsync } from "./srs/srs.sdk";
// import styles from "./styles.module.scss";

export enum PlayerStatus {
  Loading = "loading",
  Playing = "playing",
  Pause = "pause",
}

export interface SrsWhepPlayerProps {
  url: string;
  options?: React.VideoHTMLAttributes<HTMLVideoElement>;
  rtcOpts?: any;
  width: number;
  height: number;
  videoRef: React.MutableRefObject<any>;
}

export const SrsPlayer: React.FC<SrsWhepPlayerProps> = ({
  url,
  options,
  rtcOpts,
  width,
  height,
  videoRef,
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
        // handlePlay();
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

  useEffect(() => {
    startPlay();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, status]);

  const displayedWidth = width;
  const displayedHeight = height;

  return (
    <div
    // className={styles.player_container}
    >
      {status === PlayerStatus.Loading ? (
        <div
        // className={styles.player_mask}
        >
          <span>Loading...</span>
        </div>
      ) : (
        <video
          // className={cn( styles.player_video)}
          ref={videoRef}
          // onClick={handleVideoClick}
          // onMouseMove={handleMouseMove}
          style={{
            width: `${displayedWidth}px`,
            height: `${displayedHeight}px`,
          }}
          {...videoOptions}
          controls={true}
        />
      )}
    </div>
  );
};
