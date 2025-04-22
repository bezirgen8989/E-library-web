import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Collapse } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styles from "./AskQuestionComponent.module.scss";
import Send from "../../../../assets/images/icons/sendIcon.svg";
import CollapseIcon from "../../../../assets/images/icons/CollapseIcon.svg";
import DocumentIcon from "../../../../assets/images/icons/document.svg";
import SoundOnIcon from "../../../../assets/images/icons/SoundOn.svg";
import SoundOffIcon from "../../../../assets/images/icons/SoundOff.svg";
import BookIcon from "../../../../assets/images/icons/Book.svg";
import ClearIcon from "../../../../assets/images/icons/Clear.svg";
import ArrowDown from "../../../../assets/images/icons/arrowProfile.svg";
import ChatSpinner from "../../../../components/common/ChatSpinner";
import { SrsPlayer } from "../../../../components/common/SrsPlayer";
import ReactQuill from "react-quill";
import ChooseAvatar from "./common/ChooseAvatar/ChooseAvatar";
import ChooseAvatarStep2 from "./common/ChooseAvatarStep2/ChooseAvatarStep2";
import ChooseAvatarStep3 from "./common/ChooseAvatarStep3/ChooseAvatarStep3";
import ChooseAvatarStep4 from "./common/ChooseAvatarStep4/ChooseAvatarStep4";
import VoiceRecorder from "../../../../components/Voice/VoiceRecorder/VoiceRecorder";
import LanguageModal from "../../../Auth/components/LanguageModal";
import NoAvatar from "../../../../assets/images/icons/uploadBg.png";
import { useDispatch } from "react-redux";
import {
  selectAvatarLanguage,
  // setAvatarStreamShow,
  setIsStopQuestion,
  setIsStreamShow,
  setStreamDone,
} from "../../slices/home";
import MetaModal from "../common/MetaModal/MetaModal";
import { UserContext } from "../../../../core/contexts";
// @ts-ignore
import silentAvatar from "../../../../assets/videos/silent.mp4";
import { useLazySelector } from "../../../../hooks";
import { useTranslation } from "react-i18next";
import { TokenManager } from "../../../../utils";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "hooks/useQuery";
// import {getLocalization} from "../../../Auth/slices/auth";
// import { useQuery } from "../../../../hooks/useQuery";
// import { useAuthState } from "../../../Auth/slices/auth";
// import {useSocket} from "../../../../hooks/useSocket";

type Chat = {
  type: "user" | "system";
  message: string;
};

type LanguageType = {
  id: number;
  name: string;
  isoCode2char: string;
  flag: {
    link: string;
  };
};

type FormValues = {
  question: string;
};

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

type AskQuestionComponentProps = {
  setQuestion: (text: string) => void;
  clearMessages: () => void;
  messages: any;
  isLoading: boolean;
  title: string;
  metaData: any;
  avatars: any;
  setUserAvatar: (id: number) => void;
  chatHistory: any;
  languages: LanguageType[];
  indexName: string;
  isChooseAvatarPage?: boolean;
};

const { Panel } = Collapse;

dayjs.extend(customParseFormat);

const AskQuestionComponent: React.FC<AskQuestionComponentProps> = ({
  setQuestion,
  clearMessages,
  title,
  isLoading,
  metaData,
  avatars,
  setUserAvatar,
  chatHistory,
  languages,
  indexName,
  isChooseAvatarPage,
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { push } = useHistory();
  const dispatch = useDispatch();
  const value = useContext(UserContext);
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>();

  const isTextInInput = !!watch()?.question?.length;

  console.log(isTextInInput);

  const [messageClass, setMessageClass] = useState(styles.messageSystemChange);
  const [messageTime, setMessageTime] = useState<string>("");
  console.log(messageTime);
  const [isCollapseVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const videoRef = useRef<HTMLVideoElement | any>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [, setFormData] = useState<FormData | undefined>();
  const quillRef = useRef<ReactQuill>(null);
  const cursorPositionRef = useRef<null | number>(null);
  const [url, setUrl] = useState<any>();
  const [, setIsStreamConnect] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);
  const [voiceChatHistory, setVoiceChatHistory] = useState<any>([]);
  const [isMuted, setIsMuted] = useState(false);

  const currentStep = useQuery("currentStep");
  const selectedBookId = useQuery("selectedBook");

  console.log("selectedBookId", selectedBookId);
  console.log("chatHistory", chatHistory);
  console.log("voiceChatHistory", voiceChatHistory);
  useEffect(() => {
    if (!currentStep) {
      push(`${pathname}?currentStep=${4}`);
    }
  }, [currentStep]);

  const { avatarStreamShow, streamDone } = useLazySelector(({ home }) => {
    const { avatarStreamShow, streamDone } = home;
    return {
      avatarStreamShow,
      streamDone,
    };
  });

  const [initialSlide, setInitialSlide] = useState<number>(0);
  const [defaultAvatarId] = useState(value?.avatarSettings?.id || 1);
  const [currentImage, setCurrentImage] = useState<AvatarData | null>(null);
  const [recording, setRecording] = useState(false);

  // useEffect(() => {
  //   if (value?.language?.isoCode2char) {
  //     dispatch(getLocalization(value?.language?.isoCode2char));
  //   }
  // }, [dispatch, value?.language?.isoCode2char]);

  useEffect(() => {
    if (avatars?.result?.data?.length && value) {
      const initialAvatarIndex = avatars?.result?.data.findIndex(
        (avatar: AvatarData) => avatar.id === value?.avatarSettings?.id
      );
      const foundIndex = initialAvatarIndex !== -1 ? initialAvatarIndex : 0;
      setInitialSlide(foundIndex);

      const initialAvatar = avatars?.result?.data[foundIndex];
      setCurrentImage(initialAvatar);
      setSelectedAvatar(initialAvatar.avatarPicture.link);

      if (isChooseAvatarPage) {
        push(`${pathname}?currentStep=${1}`);
      } else {
        const selectedBookQuery = selectedBookId
          ? `&currentStep=${currentStep}`
          : "";
        push(
          `${pathname}?currentStep=${
            foundIndex === 0 ? 1 : 4
          }${selectedBookQuery}`
        );
      }
    }
  }, [defaultAvatarId, isChooseAvatarPage]);

  const defaultLanguage = (languages || []).find(
    (lang) => lang.name === "English"
  ) || {
    id: 0,
    name: "Select Language",
    flag: { link: NoAvatar },
    isoCode2char: "code",
  };

  useEffect(() => {
    if (languages && languages.length > 0) {
      const englishLanguage = languages.find((lang) => lang.name === "English");
      if (englishLanguage) {
        setSelectedLanguage(englishLanguage);
      }
    }
  }, [languages]);

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatHistory, isSending, voiceChatHistory]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onLanguageSelect = (language: LanguageType) => {
    setSelectedLanguage(language);
    dispatch(selectAvatarLanguage(language));
    // sessionStorage.setItem("selectedLanguage", JSON.stringify(language.id));
  };

  const addTextWithDelay = async (res: string) => {
    const quillEditor = quillRef?.current?.getEditor();

    if (res !== undefined) {
      if (cursorPositionRef.current !== null) {
        const position = cursorPositionRef.current;

        if (quillEditor) {
          quillEditor?.insertText(position, res);
          const result: any = position + res?.length;
          quillEditor?.setSelection(result);
        }
      }
    }
  };

  useEffect(() => {
    const fetchStreamUrl = async () => {
      const token = TokenManager.getAccessToken();
      try {
        const response = await fetch(
          "https://elib.plavno.io:8080/api/v1/srs/url",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const text = await response.text();
        console.log("Response text (URL):", text);

        setUrl(text);
      } catch (error) {
        console.error("Error fetching stream URL:", error);
      }
    };
    fetchStreamUrl();
  }, []);

  const clickCursor = () => {
    if (cursorPositionRef.current === null) {
      const quillEditor = quillRef?.current?.getEditor();
      cursorPositionRef.current =
        quillEditor?.getText()?.length === 1
          ? 0
          : quillEditor?.getText()?.length || 0;
    }
  };

  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const currentTime = getCurrentTime();
    console.log("DATA", data);
    setQuestion(data.question);
    clearMessages();
    setMessageClass(styles.messageSystem);
    setMessageTime(currentTime);
    setIsSending(true);
    setIsStreamConnect(true);
    setValue("question", "");
    reset();
    setFormData(undefined);

    setTimeout(() => {
      setIsSending(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSending) {
      e.preventDefault();
      handleSubmit((data) => {
        onSubmit(data);
        setIsStreamConnect(true);
        dispatch(setIsStreamShow(true));
        setIsEmpty(true);
        dispatch(setIsStopQuestion(false));
        dispatch(setStreamDone(true));
      })();
    }
  };

  const renderMetaData = () => {
    if (metaData && metaData.length > 0) {
      return metaData.map((item: any, index: number) => {
        const pageNumber = item?.meta?.loc?.pageNumber;
        const linesFrom = item?.meta?.loc?.lines?.from;
        const linesTo = item?.meta?.loc?.lines?.to;
        const contentExcerpt = item?.content?.substring(0, 300) || "";

        if (pageNumber && linesFrom && linesTo) {
          return (
            <Panel
              key={index}
              header={
                <div className={styles.panelHeader}>
                  <img
                    src={DocumentIcon}
                    alt="Document Icon"
                    className={styles.documentIcon}
                  />
                  <span>Page {pageNumber}</span>
                </div>
              }
              showArrow={false}
            >
              <div>
                <p>
                  <strong>Location:</strong> Page {pageNumber}, Lines{" "}
                  {linesFrom}-{linesTo}
                </p>
                <p>
                  <strong>Content Excerpt:</strong> {contentExcerpt}...
                </p>
              </div>
            </Panel>
          );
        } else {
          console.warn("Incomplete meta data at index:", index, item);
          return null;
        }
      });
    }
    return null;
  };

  useEffect(() => {
    let prevPath = location.pathname;

    return () => {
      if (
        prevPath.includes("ask_question") &&
        !location.pathname.includes("ask_question")
      ) {
        if (value?.id) {
          stopAvatarGeneration({ client_id: String(value.id) });
        }
        // setAvatarStreamShow(false);
        dispatch(setIsStopQuestion(true));
        dispatch(setStreamDone(false));
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (!location.pathname.includes("ask_question") && videoRef.current) {
        if (value?.id) {
          stopAvatarGeneration({ client_id: String(value.id) });
        }
        videoRef.current.srcObject = null;
        setIsStreamConnect(false);
      }
    };

    handleRouteChange();

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [location.pathname]);

  const [chatMessages, setChatMessages] = useState<Chat[]>([]);

  useEffect(() => {
    setChatMessages(
      [...voiceChatHistory, ...chatHistory].sort((a, b) => {
        const timeA = dayjs(a.timestamp, "h:mm:ss A", true).unix();
        const timeB = dayjs(b.timestamp, "h:mm:ss A", true).unix();
        return timeA - timeB;
      })
    );
  }, [chatHistory, voiceChatHistory]);

  const token = TokenManager.getAccessToken();

  const stopAvatarGeneration = async (params: any) => {
    try {
      const response = await fetch(
        "https://avatar19413587.plavno.app:24828/stop",
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(params),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error stopping avatar generation:", error);
    }
  };
  console.log("selectedAvatar", selectedAvatar);

  const chooseAvatarSteps = {
    "1": (
      <ChooseAvatar
        avatars={avatars.result}
        // setCurrentStep={setCurrentStep}
        setSelectedAvatar={setSelectedAvatar}
        setUserAvatar={setUserAvatar}
        initialSlide={initialSlide}
        setInitialSlide={setInitialSlide}
        defaultAvatarId={defaultAvatarId}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
        isChooseAvatarPage
      />
    ),
    "2": (
      <ChooseAvatarStep2
        // setCurrentStep={setCurrentStep}
        // selectedAvatar={selectedAvatar}
        selectedAvatar={
          "https://elore.sfo3.cdn.digitaloceanspaces.com/avatarsImages/avatars/male2.jpg"
        }
      />
    ),
    "3": (
      <ChooseAvatarStep3
        // setCurrentStep={setCurrentStep}
        // selectedAvatar={selectedAvatar}
        selectedAvatar="https://elore.sfo3.cdn.digitaloceanspaces.com/avatarsImages/avatars/male2.jpg"
      />
    ),
    "4": (
      <ChooseAvatarStep4
        // setCurrentStep={setCurrentStep}
        // selectedAvatar={selectedAvatar}
        selectedAvatar="https://elore.sfo3.cdn.digitaloceanspaces.com/avatarsImages/avatars/male2.jpg"
      />
    ),
  };

  return (
    <>
      {chooseAvatarSteps[currentStep as keyof typeof chooseAvatarSteps]}
      {currentStep === "5" && (
        <div>
          <div className={styles.askQuestionPage}>
            <div className={styles.askQuestionWrapper}>
              <div className={styles.askQuestionVideo}>
                <div
                  style={{
                    position: "relative",
                    height: 290,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      opacity: avatarStreamShow ? 1 : 0,
                      pointerEvents: avatarStreamShow ? "auto" : "none",
                    }}
                    className={styles.shadowBG}
                  >
                    {url && (
                      <SrsPlayer
                        url={url}
                        width={"100%"}
                        height={"100%"}
                        videoRef={videoRef}
                        options={{
                          autoPlay: true,
                          playsInline: true,
                          muted: isMuted,
                          controls: true,
                        }}
                        rtcOpts={{
                          audio: {
                            enable: true,
                          },
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      opacity: avatarStreamShow ? 0 : 1,
                      pointerEvents: avatarStreamShow ? "none" : "auto",
                    }}
                    className={styles.shadowBG}
                  >
                    <video
                      playsInline
                      muted
                      preload="auto"
                      src={silentAvatar}
                      width={430}
                      loop={true}
                      autoPlay={true}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div className={styles.askQuestionBookTitle}>
                  <div className={styles.bookTitle}>
                    <div
                      className={styles.bookTitle__wrapper}
                      style={{ marginRight: 10 }}
                    >
                      <img
                        src={BookIcon}
                        alt="Sound Off Icon"
                        className={styles.bookIcon}
                      />
                      {pathname.includes("ask_global_question")
                        ? t("askGlobalTitle")
                        : title}
                    </div>
                    <div className={styles.bookTitle__speachBlock}>
                      <div
                        onMouseDown={(e) => {
                          e.preventDefault();
                          showModal();
                        }}
                        className={styles.languageSelectWrapper}
                        style={{
                          opacity: !recording ? "1" : "0.5",
                          pointerEvents: recording ? "none" : "auto",
                        }}
                      >
                        <div
                          className={styles.languageSelect}
                          style={{
                            backgroundImage: `url(${selectedLanguage.flag.link})`,
                          }}
                        />
                        <span>{selectedLanguage?.name}</span>
                      </div>
                      <button
                        type="button"
                        className={styles.muteBtn}
                        onClick={() => {
                          setIsMuted(!isMuted);
                          if (videoRef.current) {
                            videoRef.current.muted = !isMuted;
                          }
                        }}
                        disabled={!avatarStreamShow}
                      >
                        <img
                          src={isMuted ? SoundOnIcon : SoundOffIcon}
                          alt={isMuted ? "Sound On Icon" : "Sound Off Icon"}
                          className={styles.soundOffIcon}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.askQuestionChat}>
                <div className={styles.chatContainer}>
                  <div className={styles.gradientOverlay} />

                  <div className={styles.chatContent} ref={chatContentRef}>
                    {chatMessages.map((chat, index) => {
                      const isLastMessage = index === chatMessages.length - 1;

                      return (
                        <div
                          key={index}
                          className={
                            chat.type === "user"
                              ? styles.messageUser
                              : messageClass
                          }
                        >
                          <div
                            className={
                              chat.type === "user"
                                ? styles.userMessage
                                : styles.messageSystemContent
                            }
                          >
                            {chat.type !== "user" &&
                              isLastMessage &&
                              isLoading &&
                              !chat.message && <ChatSpinner />}
                            {chat.message}
                            {/*{chat.type === "user" && (*/}
                            {/*  <div className={styles.messageSystemBottom}>*/}
                            {/*    <span className={styles.messageTime}>*/}
                            {/*      {messageTime}*/}
                            {/*    </span>*/}
                            {/*  </div>*/}
                            {/*)}*/}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {metaData && metaData.length > 0 && !isLoading && !isSending && (
                    <div
                      className={styles.collapseButton}
                      onClick={() => {
                        setIsMetaModalOpen(true);
                      }}
                    >
                      <span style={{ paddingRight: 10 }}>
                        {isCollapseVisible
                          ? "Hide used resources"
                          : "Show used resources"}
                      </span>
                      <img
                        style={{
                          transform: `rotate(${
                            isCollapseVisible ? 180 : 0
                          }deg)`,
                        }}
                        src={isCollapseVisible ? ArrowDown : CollapseIcon}
                        alt="icon"
                      />
                    </div>
                  )}

                  <div className={styles.collapseContent}>
                    {isCollapseVisible && (
                      <Collapse>{renderMetaData()}</Collapse>
                    )}
                  </div>

                  <div className={styles.chatWrap}>
                    <div className={styles.chatInputSection}>
                      {!recording && (
                        <input
                          {...register("question", { required: true })}
                          type="text"
                          className={styles.chatInput}
                          placeholder={t("questionPlaceholder")}
                          autoComplete="off"
                          onKeyDown={handleKeyDown}
                          onInput={(e) =>
                            setIsEmpty(e.currentTarget.value === "")
                          }
                          disabled={!isFirst}
                        />
                      )}

                      {!isEmpty && (
                        <button
                          type="button"
                          className={styles.clearButton}
                          onClick={() => {
                            setValue("question", "");
                            setIsEmpty(true);
                          }}
                        >
                          <img src={ClearIcon} alt="clear" />
                        </button>
                      )}
                      {isTextInInput ? (
                        <button
                          type="button"
                          className={styles.submitButton}
                          disabled={isSending}
                          onClick={() => {
                            handleSubmit((data) => {
                              onSubmit(data);
                              setIsStreamConnect(true);
                              dispatch(setIsStreamShow(true));
                              setIsEmpty(true);
                              dispatch(setIsStopQuestion(false));
                              dispatch(setStreamDone(true));
                            })();
                          }}
                        >
                          <img src={Send} alt="btn" />
                        </button>
                      ) : (
                        <VoiceRecorder
                          link=""
                          addTextWithDelay={addTextWithDelay}
                          clickCursor={clickCursor}
                          isLoadingData={false}
                          setQuestion={setQuestion}
                          setIsStreamConnect={setIsStreamConnect}
                          userId={value?.id?.toString()}
                          selectedLanguageCode={selectedLanguage.isoCode2char}
                          indexName={indexName}
                          isFirst={isFirst}
                          setIsFirst={setIsFirst}
                          setChatHistory={setVoiceChatHistory}
                          setMessageClass={setMessageClass}
                          streamDone={streamDone}
                          recording={recording}
                          setRecording={setRecording}
                          stopAvatarGeneration={stopAvatarGeneration}
                        />
                      )}

                      {/*{!streamDone ? (*/}
                      {/*  <button*/}
                      {/*    type="button"*/}
                      {/*    className={styles.submitButton}*/}
                      {/*    disabled={isSending}*/}
                      {/*    onClick={() => {*/}
                      {/*      handleSubmit((data) => {*/}
                      {/*        onSubmit(data);*/}
                      {/*        setIsStreamConnect(true);*/}
                      {/*        dispatch(setIsStreamShow(true));*/}
                      {/*        setIsEmpty(true);*/}
                      {/*        dispatch(setIsStopQuestion(false));*/}
                      {/*        dispatch(setStreamDone(true));*/}
                      {/*      })();*/}
                      {/*    }}*/}
                      {/*  >*/}
                      {/*    <img src={Send} alt="btn" />*/}
                      {/*  </button>*/}
                      {/*) : (*/}
                      {/*  <button*/}
                      {/*    type="button"*/}
                      {/*    className={styles.stopButton}*/}
                      {/*    disabled={isSending}*/}
                      {/*    onClick={() => {*/}
                      {/*      stopAvatarGeneration({*/}
                      {/*        client_id: String(value.id),*/}
                      {/*      });*/}
                      {/*      dispatch(setIsStopQuestion(true));*/}
                      {/*      dispatch(setStreamDone(false));*/}
                      {/*    }}*/}
                      {/*  >*/}
                      {/*    <div className={styles.beforeIcon} />*/}
                      {/*  </button>*/}
                      {/*)}*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <LanguageModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            languages={languages || []}
            defaultLanguage={defaultLanguage}
            onLanguageSelect={onLanguageSelect}
          />
          <MetaModal
            isModalOpen={isMetaModalOpen}
            setIsModalOpen={setIsMetaModalOpen}
            metaData={renderMetaData()}
          />
        </div>
      )}
    </>
  );
};

export default AskQuestionComponent;
