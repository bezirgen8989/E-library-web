import React, { useEffect, useRef, useState } from "react";
import { defaultVideoOptions, getIdFromUrl } from "./helpers";
import { SrsRtcWhipWhepAsync } from "./srs/srs.sdk";
import { useLazySelector } from "../../../hooks";
import { useDispatch } from "react-redux";
// @ts-ignore
import silentAvatar from "../../../assets/videos/silent.mp4";
import { setIsStreamShow } from "../../../modules/Home/slices/home";

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
  const dispatch = useDispatch();

  const { avatarStreamShow } = useLazySelector(({ home }) => {
    const { avatarStreamShow } = home;
    return {
      avatarStreamShow,
    };
  });
  console.log("avatarStreamShow123", avatarStreamShow);

  const { isStreamShow } = useLazySelector(({ home }) => {
    const { isStreamShow } = home;
    return { isStreamShow };
  });

  const checkTracksState = () => {
    if (srsSdkRef.current && srsSdkRef.current.stream) {
      const tracks = srsSdkRef.current.stream.getTracks();
      console.log("tracks", tracks);

      if (tracks[1]._muted) {
        dispatch(setIsStreamShow(false));
        setStatus(PlayerStatus.Loading);
        cleanup();
      } else {
        setTimeout(checkTracksState, 1000);
      }
    }
  };

  const videoOptions = {
    ...defaultVideoOptions,
    ...options,
  };
  const srsSdkRef = useRef<typeof SrsRtcWhipWhepAsync | any>(null);

  const id = getIdFromUrl(url);
  const [status, setStatus] = useState(PlayerStatus.Loading);

  const startPlay = async () => {
    // @ts-ignore
    srsSdkRef.current = new SrsRtcWhipWhepAsync();
    try {
      await srsSdkRef.current.play(url, rtcOpts);
      setStatus(PlayerStatus.Playing);

      if (videoRef.current) {
        videoRef.current.srcObject = srsSdkRef.current.stream;
      }

      srsSdkRef.current.pc.oniceconnectionstatechange = () => {
        console.log("ICE State:", srsSdkRef?.current?.pc?.iceConnectionState);
        if (srsSdkRef?.current?.pc?.iceConnectionState === "completed") {
          checkTracksState();
        }
      };
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
    // @ts-ignore
    clearTimeout(checkTracksState);
  };

  useEffect(() => {
    startPlay();

    return () => {
      cleanup();
    };
  }, [url, status, isStreamShow]);

  const displayedWidth = width;
  const displayedHeight = height;

  return (
    <>
      <div>
        {!avatarStreamShow ? (
          <div>
            <video width={300} height={300} loop autoPlay>
              <source src={silentAvatar} type="video/mp4" />
            </video>
            <span style={{ color: "white" }}>Silent</span>
          </div>
        ) : (
          <div>
            <video
              ref={videoRef}
              style={{
                width: `${displayedWidth}px`,
                height: `${displayedHeight}px`,
              }}
              {...videoOptions}
              controls={true}
            />
            <span style={{ color: "white" }}>Show Stream</span>
          </div>
        )}
        {!isStreamShow ? (
          <div>
            <video width={300} height={300} loop autoPlay>
              <source src={silentAvatar} type="video/mp4" />
            </video>
            <span style={{ color: "white" }}>Silent</span>
          </div>
        ) : (
          <div>
            <video
              ref={videoRef}
              style={{
                width: `${displayedWidth}px`,
                height: `${displayedHeight}px`,
              }}
              {...videoOptions}
              controls={true}
            />
            <span style={{ color: "white" }}>Show Stream</span>
          </div>
        )}
      </div>
    </>
  );
};
