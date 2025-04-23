import React, { useEffect, useState } from "react";
import { defaultVideoOptions, getIdFromUrl } from "./helpers";
import { SrsRtcWhipWhepAsync } from "./srs/srs.sdk";
import { useLazySelector } from "../../../hooks";
import { useDispatch } from "react-redux";
// @ts-ignore
import silentAvatar from "../../../assets/videos/silent.mp4";
import { setIsStreamShow } from "../../../modules/Home/slices/home";
import { stopAvatarGeneration } from "../../../helpers/stopAvatarGeneration";
import { useAuthState } from "../../../modules/Auth/slices/auth";
import { TokenManager } from "../../../utils";

export enum PlayerStatus {
  Loading = "loading",
  Playing = "playing",
  Pause = "pause",
}

export interface SrsWhepPlayerProps {
  url: string;
  options?: React.VideoHTMLAttributes<HTMLVideoElement>;
  rtcOpts?: any;
  width: number | string;
  height: number | string;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  srsSdkRef: typeof SrsRtcWhipWhepAsync | any;
  unsubscribeFromEvent?: any;
}

export const SrsPlayer: React.FC<SrsWhepPlayerProps> = ({
  url,
  options,
  rtcOpts,
  width,
  height,
  videoRef,
  srsSdkRef,
  unsubscribeFromEvent,
}) => {
  const dispatch = useDispatch();
  const { userData } = useAuthState();
  const token = TokenManager.getAccessToken();

  const { avatarStreamShow } = useLazySelector(({ home }) => {
    const { avatarStreamShow, isStreamShow } = home;
    return {
      avatarStreamShow,
      isStreamShow,
    };
  });
  console.log("avatarStreamShow123", avatarStreamShow);

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
    controls: false,
  };

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
      srsSdkRef.current.srcObject = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // @ts-ignore
    clearTimeout(checkTracksState);
  };

  useEffect(() => {
    if (avatarStreamShow) {
      startPlay();
    }

    return () => {
      cleanup();
    };
  }, [url, status, avatarStreamShow]);

  useEffect(() => {
    return () => {
      stopAvatarGeneration({ client_id: userData.result.id.toString() }, token);
      unsubscribeFromEvent("publish-stream");
      unsubscribeFromEvent("unpublish-stream");
      cleanup();
    };
  }, []);

  const displayedWidth = width;
  const displayedHeight = height;

  return (
    <video
      ref={videoRef}
      style={{
        width: `${displayedWidth}`,
        height: `${displayedHeight}px`,
        pointerEvents: "none", // Отключаем события мыши
      }}
      {...videoOptions}
    />
  );
};
