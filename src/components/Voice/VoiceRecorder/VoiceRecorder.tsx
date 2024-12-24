import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { Mic, Trash2 } from "lucide-react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
// import { useNotification } from '@refinedev/core';
import { Spin, Tooltip } from "antd";
import classNames from "classnames";

// import { CUSTOM_BUTTONS_TYPES, CustomButton } from '@components/Button';
// import {
//   renderLangCodes,
// } from '@helper';
// import { useVoice } from 'src/hooks/useVoice';
// import SpinMic from '@components/SpinMic';
// import CustomIcon, { ICON_TYPES } from '@components/CustomIcon';

import styles from "./styles.module.scss";
import { renderLangCodes } from "../../../helpers/helper";
import { useVoice } from "../../../hooks/useVoice";
import { CUSTOM_BUTTONS_TYPES, CustomButton } from "../Button";
import SpinMic from "../SpinMic";
import CustomIcon, { ICON_TYPES } from "../CustomIcon";

interface IVoiceRecorder {
  isNonHealth?: boolean;
  addTextWithDelay: (values: string) => void;
  selectedLanguage: string;
  setIsRecordingInProcess: (isInProcess: boolean) => void;
  clickCursor: () => void;
  isLoadingData?: boolean;
  link: string;
  setFormData: (formData: any) => void;
}

const VoiceRecorder: React.FC<IVoiceRecorder> = ({
  isLoadingData,
  clickCursor,
  addTextWithDelay,
  isNonHealth,
  selectedLanguage,
  setIsRecordingInProcess,
  setFormData,
  link,
}) => {
  // const { open } = useNotification();
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<any>(null);
  const progressRef = useRef<HTMLParagraphElement>(null);

  const [isFirst, setIsFirst] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const [isReadyPaused, setIsReadyPaused] = useState(false);

  const language = renderLangCodes(selectedLanguage);
  // ///////////////

  const [
    stopStreaming,
    startStreaming,
    deleteStreaming,
    connectToWhisper,
    pauseStreaming,
  ] = useVoice({
    language,
    setTextAreaValue: addTextWithDelay,
    paused,
    setIsRecordingInProcess,
  });

  // ///////////

  const [hasMicrophoneAccess, setHasMicrophoneAccess] = useState<
    boolean | null
  >(null);

  // Function to check microphone access
  const checkMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicrophoneAccess(true);
      // You may want to stop the stream immediately if you're only checking for permissions
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
    // if (!hasMicrophoneAccess) {
    //   open && open({
    //     message: 'Please enable it in your browser settings',
    //     type: 'error',
    //     description: 'Microphone access denied',
    //   });
    //
    //   return;
    // }

    // Destroy existing instance if any
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    if (recordingUrl) {
      return;
    }

    clickCursor();

    wavesurferRef.current = WaveSurfer.create({
      container: "#mic",
      waveColor: "#2E3946",
      progressColor: "#2E3946",
      height: 24,
      width: isNonHealth ? "850px" : "220px",
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

    recordRef.current.on("record-end", async (blob: Blob) => {
      const formData = new FormData();
      formData.append("files", blob, "audio.wav");
      formData.append("prefix", "doctor");
      formData.append("postfix", "audio");
      console.log(11111111111, formData);

      setFormData(formData);
      const recordedUrl = URL.createObjectURL(blob);
      await setRecordingUrl(recordedUrl);
      createRecordedWaveSurfer(recordedUrl, "#play");
    });

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
      waveColor: "#2E3946",
      progressColor: "#2E3946",
      height: 24,
      width: isNonHealth ? "860px" : "220px",
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

    const formattedTime = [
      Math.floor((time % 3600000) / 60000),
      Math.floor((time % 60000) / 1000),
    ]
      .map((v) => (v < 10 ? "0" + v : v))
      .join(":");
    progressRef.current.textContent = formattedTime;
  };

  const renderText = () => {
    if (recordingUrl) {
      return "Recording is ready!";
    }

    if (!isFirst && paused) {
      return "Paused";
    }

    if (!isFirst && !paused) {
      return "Speak now";
    }
  };

  const handleRecordClick = async () => {
    if (!hasMicrophoneAccess) {
      return;
    }

    if (recording || paused) {
      // Stop recording
      recordRef.current?.stopRecording();
      setRecording(false);
      setPaused(false);
      stopStreaming();

      return;
    }

    setRecording(true);
    await recordRef.current?.startRecording();
  };

  const handlePauseClick = () => {
    if (paused) {
      recordRef.current?.resumeRecording();
      setPaused(false);
    } else {
      recordRef.current?.pauseRecording();
      setPaused(true);
    }

    pauseStreaming();
  };

  useEffect(() => {
    if (!isConnecting) {
      return;
    }

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

  if (isLoadingData) {
    return (
      <div className={styles.wrapper}>
        <Spin />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
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

      {link ? (
        <div className={styles.blockForReadyAudio}>
          <div className={styles.voiceBlock}>
            <p className={styles.name}>Your Recording </p>
            <div
              className={styles.recordingForReadyAudio}
              id="recordings"
            ></div>{" "}
          </div>
        </div>
      ) : isFirst ? (
        <div className={styles.initialBlock}>
          <div className={styles.text}>
            <div>Click the button to start recording your voice...</div>
            <div>Is your microphone ready?</div>
          </div>
          <div className={styles.btnMic}>
            <CustomButton
              title=""
              icon={isConnecting ? <SpinMic /> : <Mic size={24} />}
              width={48}
              onClick={() => {
                setIsConnecting(true);
              }}
            />
          </div>
        </div>
      ) : (
        <div className={styles.voiceBlock}>
          <p className={styles.name}>{renderText()}</p>
          <CustomButton
            onClick={() => {
              setIsReadyPaused(!isReadyPaused);
            }}
            className={!recordingUrl ? styles.hiddenPlayBtn : styles.playBtn}
            title=""
            id={"#play"}
            icon={
              isReadyPaused ? (
                <CustomIcon type={ICON_TYPES.PAUSE_RECORD} />
              ) : (
                <CustomIcon type={ICON_TYPES.START_RECORD} />
              )
            }
          />

          <div className={styles.recording} id="recordings"></div>
          {recordingUrl && (
            <CustomButton
              className={styles.deleteBtn}
              onClick={() => {
                setRecordingUrl(null);
                setIsFirst(true);
                setIsReadyPaused(false);
                deleteStreaming();
              }}
              title=""
              color={CUSTOM_BUTTONS_TYPES.LIGHT}
              icon={<Trash2 color="#E44E58" />}
            />
          )}
          {!recordingUrl && (
            <>
              <div className={styles.readyRecordingWrapper}>
                <div id="mic" className={styles.stopBtn}></div>
              </div>
              <div style={{ display: "flex" }}>
                <Tooltip title="Stop" placement="top">
                  <div>
                    <CustomButton
                      className={styles.stopRecording}
                      width={87}
                      title=""
                      onClick={handleRecordClick}
                      icon={
                        <div
                          className={classNames(
                            styles.stopBtnIconWrapper,
                            !paused && styles.stopBtnIconWrapperPaused
                          )}
                        >
                          <CustomIcon type={ICON_TYPES.CIRCLE_RECORD} />
                          {recording ? (
                            <p
                              className={styles.progressBlock}
                              id="progress"
                              ref={progressRef}
                            >
                              00:00
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      }
                    />
                  </div>
                </Tooltip>
                <Tooltip title={paused ? "Continue" : "Pause"} placement="top">
                  <div>
                    <CustomButton
                      className={styles.btnPause}
                      title=""
                      onClick={handlePauseClick}
                      icon={
                        !paused ? (
                          <CustomIcon type={ICON_TYPES.PAUSE_RECORD} />
                        ) : (
                          <CustomIcon type={ICON_TYPES.START_RECORD} />
                        )
                      }
                    />
                  </div>
                </Tooltip>
                <CustomButton
                  className={styles.deleteBtn}
                  onClick={() => {
                    setRecordingUrl(null);
                    setIsFirst(true);
                    setIsReadyPaused(false);
                  }}
                  title=""
                  color={CUSTOM_BUTTONS_TYPES.LIGHT}
                  icon={<Trash2 color="#E44E58" />}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default VoiceRecorder;
