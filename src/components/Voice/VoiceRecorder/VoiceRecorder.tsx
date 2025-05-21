import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
import MicIcon from "../../../assets/images/icons/MicIconBrown.svg";
import MuteMicIcon from "../../../assets/images/icons/MuteMicIconBrown.svg";
import { Button, Spin, Tooltip } from "antd";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { renderLangCodes } from "../../../helpers/helper";
import { useVoice } from "../../../hooks/useVoice";
import { CustomButton } from "../Button";
import SpinMic from "../SpinMic";
import CustomIcon, { ICON_TYPES } from "../CustomIcon";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useAuthState } from "../../../modules/Auth/slices/auth";

interface IVoiceRecorder {
  isNonHealth?: boolean;
  addTextWithDelay: (values: string) => void;
  clickCursor: () => void;
  isLoadingData?: boolean;
  link: string;
  userId: any;
  selectedLanguageCode: string;
  isFirst: boolean;
  setIsFirst: (value: boolean) => void;
  indexName: string;
  setChatHistory: any;
  setMessageClass: any;
  streamDone: any;
  recording: any;
  setRecording: any;
  stopAvatarGeneration: (params: any, token: string) => Promise<void>;
}

const VoiceRecorder: React.FC<IVoiceRecorder> = ({
  isLoadingData,
  clickCursor,
  addTextWithDelay,
  isNonHealth,
  link,
  userId,
  indexName,
  selectedLanguageCode,
  setIsFirst,
  isFirst,
  setChatHistory,
  setMessageClass,
  streamDone,
  recording,
  setRecording,
}) => {
  const { t } = useTranslation();
  const { userData } = useAuthState();
  const [recordingUrl] = useState<string | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<any>(null);
  const progressRef = useRef<HTMLParagraphElement>(null);
  const [disconnected, setDisconnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReadyPaused, setIsReadyPaused] = useState(false);

  const language = renderLangCodes(selectedLanguageCode);

  const [
    stopStreaming,
    startStreaming,
    deleteStreaming,
    connectToWhisper,
    toggleMicMute,
  ] = useVoice({
    language,
    setTextAreaValue: addTextWithDelay,
    userId,
    indexName,
    selectedLanguageCode,
    setIsShowSilent: () => console.log("setIsShowSilent"),
    setChatHistory,
    setMessageClass,
    disconnected,
  });

  useEffect(() => {
    return () => {
      deleteStreaming();
      stopStreaming();
    };
  }, [userData?.result?.id]);

  const [hasMicrophoneAccess, setHasMicrophoneAccess] = useState<
    boolean | null
  >(null);

  const [isMuted, setIsMuted] = useState(false);

  const handleMicToggle = () => {
    setIsMuted((prevState) => {
      const newMutedState = !prevState;

      const micElement = document.querySelector("#mic") as HTMLElement;
      if (micElement) {
        micElement.style.opacity = newMutedState ? "0" : "1";
        micElement.style.pointerEvents = newMutedState ? "none" : "auto";
      }

      return newMutedState;
    });

    toggleMicMute();
  };

  // Function to check microphone access
  const checkMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicrophoneAccess(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      setHasMicrophoneAccess(false);
    }
  };

  useEffect(() => {
    checkMicrophoneAccess();
  }, []);

  useEffect(() => {
    if (link) {
      createRecordedWaveSurfer(link, "#playBtn", true);
    }
  }, [isLoadingData, hasMicrophoneAccess]);

  const createWaveSurfer = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    if (recordingUrl) {
      return;
    }

    clickCursor();

    wavesurferRef.current = WaveSurfer.create({
      container: "#mic",
      waveColor: "white",
      progressColor: "white",
      height: 24,
      width: isNonHealth ? "850px" : "210px",
      barGap: 1,
      barWidth: 1.5,
      barHeight: 15,
    });

    recordRef.current = wavesurferRef.current.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      })
    );

    recordRef.current.on("record-progress", (time: number) => {
      updateProgress(time);
    });

    handleRecordClick();
  };

  const createRecordedWaveSurfer = (
    url: string,
    id: string,
    isReadyAudio = false
  ) => {
    if (!hasMicrophoneAccess) {
      return;
    }

    const container = document.querySelector("#recordings");
    const newWaveSurfer = WaveSurfer.create({
      container: container! as any,
      waveColor: "rgba(199, 204, 205, 0.6)",
      progressColor: "rgba(199, 204, 205, 0.6)",
      height: 24,
      width: isNonHealth ? "860px" : "210px",
      barGap: 1,
      barWidth: 1.5,
      barHeight: 15,
      url,
    });

    if (isReadyAudio) {
      newWaveSurfer.load(url);
    }

    const button = document.getElementById(id);

    if (!button) {
      return;
    }

    button.onclick = () => newWaveSurfer.playPause();

    newWaveSurfer.on("finish", () => setIsReadyPaused(false));
  };

  const updateProgress = (time: number) => {
    if (!progressRef.current) {
      return;
    }
    progressRef.current.textContent = [
      Math.floor((time % 3600000) / 60000),
      Math.floor((time % 60000) / 1000),
    ]
      .map((v) => (v < 10 ? "0" + v : v))
      .join(":");
  };

  useEffect(() => {
    if (recording) {
      recordRef.current?.stopRecording();
      setDisconnected(true);
      setRecording(false);
      stopStreaming();
      setIsFirst(true);
      return;
    }
    setDisconnected(false);
  }, [disconnected]);

  const handleRecordClick = async () => {
    if (!hasMicrophoneAccess) {
      return;
    }

    if (recording) {
      recordRef.current?.stopRecording();
      setDisconnected(true);
      setRecording(false);
      stopStreaming();
      setIsFirst(true);
      return;
    }
    setDisconnected(false);
    setRecording(true);
    await recordRef.current?.startRecording();
  };

  useEffect(() => {
    if (!isConnecting) {
      return;
    }
    setIsMuted(false);
    connectToWhisper();

    setTimeout(async () => {
      setIsFirst(false);
      startStreaming();
      setIsConnecting(false);
    }, 3000);
  }, [isConnecting]);

  useEffect(() => {
    if (isFirst) {
      return;
    }

    createWaveSurfer();
  }, [isFirst]);

  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
      if (recordRef.current) {
        recordRef.current.destroy();
        recordRef.current = null;
      }
      stopStreaming();
    };
  }, []);

  if (isLoadingData) {
    return (
      <div className={styles.wrapper}>
        <Spin />
      </div>
    );
  }

  return (
    <div
      className={cn(
        styles.wrapper,
        !link && !isFirst ? styles.wrapperRecording : null
      )}
    >
      <div className={styles.playBtnForReadyAudio}>
        <CustomButton
          onClick={() => {
            setIsReadyPaused(!isReadyPaused);
          }}
          className={!link ? styles.hiddenPlayBtn : styles.playBtn}
          title=""
          id={"#playBtn"}
          icon={
            isReadyPaused ? (
              <CustomIcon type={ICON_TYPES.PAUSE_RECORD} />
            ) : (
              <CustomIcon type={ICON_TYPES.START_RECORD} />
            )
          }
        />
      </div>

      {isFirst ? (
        <div className={styles.initialBlock}>
          <div className={styles.btnMic}>
            <Button
              type="default"
              disabled={streamDone}
              style={{
                justifyContent: "center",
                alignItems: "center",
                background: "#BC845A",
                padding: "0",
                border: "none",
                borderRadius: "50%",
                display: "flex",
              }}
              onClick={() => {
                setIsConnecting(true);
              }}
            >
              {isConnecting ? <SpinMic /> : <div className={styles.PlayIcon} />}
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.voiceBlock}>
          {!recordingUrl && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(100px, 210px) 40px",
                  gap: "12px",
                  marginRight: 20,
                }}
              >
                <div className={styles.readyRecordingWrapper}>
                  <div id="mic" className={styles.stopBtn}></div>
                </div>
                {recording ? (
                  <span
                    style={{ color: "white" }}
                    className={styles.progressBlock}
                    id="progress"
                    ref={progressRef}
                  >
                    00:00
                  </span>
                ) : (
                  ""
                )}
              </div>
              <Tooltip title={t("mute")} placement="top">
                <div className={styles.stopRecording} onClick={handleMicToggle}>
                  <div className={classNames(styles.muteBtnIconWrapper)}>
                    <img
                      style={{ margin: 0 }}
                      src={isMuted ? MuteMicIcon : MicIcon}
                      alt=""
                    />
                  </div>
                </div>
              </Tooltip>
              <Tooltip title={t("stop")} placement="top">
                <div
                  className={styles.stopRecording}
                  onClick={handleRecordClick}
                >
                  <div className={classNames(styles.stopBtnIconWrapper)}>
                    <div className={styles.StopIcon} />
                  </div>
                </div>
              </Tooltip>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default VoiceRecorder;
