import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Collapse } from "antd";
import styles from "./AskQuestionComponent.module.scss";
import Send from "../../../../assets/images/icons/sendIcon.svg";
import CollapseIcon from "../../../../assets/images/icons/CollapseIcon.svg";
import DocumentIcon from "../../../../assets/images/icons/document.svg";
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
import { selectAvatarLanguage } from "../../slices/home";
import { useTranslation } from "react-i18next";
import MetaModal from "../common/MetaModal/MetaModal";
import { UserContext } from "../../../../core/contexts";
// @ts-ignore
import silentAvatar from "../../../../assets/videos/silent.mp4";

type Chat = {
  type: "user" | "system"; // Assuming 'user' or 'system' are the only types of messages
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
};

const { Panel } = Collapse;

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
}) => {
  const dispatch = useDispatch();
  const value = useContext(UserContext);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [messageClass, setMessageClass] = useState(styles.messageSystemChange);
  const [messageTime, setMessageTime] = useState<string>("");
  const [isCollapseVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const videoRef = useRef<HTMLVideoElement | any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [isRecordingInProcess, setIsRecordingInProcess] = useState(false);
  const [formData, setFormData] = useState<FormData | undefined>();
  const quillRef = useRef<ReactQuill>(null);
  const cursorPositionRef = useRef<null | number>(null);
  const [url, setUrl] = useState<any>();
  const [isStreamConnect, setIsStreamConnect] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const { t } = useTranslation();
  const [isShowSilent, setIsShowSilent] = useState();
  console.log("formData", formData);
  console.log("isRecordingInProcess", isRecordingInProcess);
  console.log("valuevaluevaluevaluevalue", value);
  console.log("isStreamConnect", isStreamConnect);

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
  // console.log("Select Language", selectedLanguage);
  console.log(
    "selectedLanguageselectedLanguageselectedLanguage",
    selectedLanguage
  );

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatHistory, isSending]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onLanguageSelect = (language: LanguageType) => {
    setSelectedLanguage(language);
    dispatch(selectAvatarLanguage(language));
    sessionStorage.setItem("selectedLanguage", JSON.stringify(language.id));
  };

  const addTextWithDelay = async (res: string) => {
    const quillEditor = quillRef?.current?.getEditor();

    if (res !== undefined) {
      if (cursorPositionRef.current !== null) {
        const position = cursorPositionRef.current;

        if (quillEditor) {
          quillEditor?.insertText(position, res);
          const result: any = position + res?.length;
          // Move cursor after inserted text
          quillEditor?.setSelection(result);
        }
      }
    }
  };

  useEffect(() => {
    const fetchStreamUrl = async () => {
      const token = sessionStorage.getItem("SESSION_TOKEN");
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
    reset();
    setFormData(undefined);

    setTimeout(() => {
      setIsSending(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSending) {
      // Prevent default form submission behavior
      e.preventDefault();
      handleSubmit(onSubmit)();
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
    const handleRouteChange = () => {
      if (!location.pathname.includes("ask_question") && videoRef.current) {
        // Закрыть поток, если покидается URL ask_question
        videoRef.current.srcObject = null;
        setIsStreamConnect(false);
      }
    };

    handleRouteChange();

    // Следим за изменениями в маршруте
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [location.pathname]);

  // const toggleCollapse = () => {
  //   setIsCollapseVisible(!isCollapseVisible);
  // };

  return (
    <>
      {currentStep === 1 && (
        <ChooseAvatar
          avatars={avatars.result}
          setCurrentStep={setCurrentStep}
          setSelectedAvatar={setSelectedAvatar}
          setUserAvatar={setUserAvatar}
        />
      )}
      {currentStep === 2 && (
        <ChooseAvatarStep2
          setCurrentStep={setCurrentStep}
          selectedAvatar={selectedAvatar}
        />
      )}
      {currentStep === 3 && (
        <ChooseAvatarStep3
          setCurrentStep={setCurrentStep}
          selectedAvatar={selectedAvatar}
        />
      )}
      {currentStep === 4 && (
        <ChooseAvatarStep4
          setCurrentStep={setCurrentStep}
          selectedAvatar={selectedAvatar}
        />
      )}
      {currentStep === 5 && (
        <div className={styles.askQuestionWrap}>
          <div className={styles.bookTitle}>
            <div style={{ marginRight: 10 }}>
              {location.pathname.includes("ask_global_question")
                ? t("askGlobalTitle")
                : title}
            </div>
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                showModal();
              }}
              className={styles.languageSelectWrapper}
            >
              <div
                className={styles.languageSelect}
                style={{
                  backgroundImage: `url(${selectedLanguage.flag.link})`,
                }}
              ></div>
              <span>{selectedLanguage.name}</span>
            </div>
          </div>
          <div className={styles.askQuestionPage}>
            <div className={styles.avatarSide}>
              {/*{!isStreamConnect && (*/}
              {/*  <div*/}
              {/*    className={styles.avatarFace}*/}
              {/*    style={{ backgroundImage: `url(${selectedAvatar})` }}*/}
              {/*  />*/}
              {/*)}*/}
              {!isShowSilent && (
                <video width={300} height={300} loop autoPlay>
                  <source src={silentAvatar} type="video/mp4" />
                </video>
              )}
              {isShowSilent && (
                <SrsPlayer
                  url={url}
                  width={300}
                  height={300}
                  videoRef={videoRef}
                  options={{
                    autoPlay: true,
                    playsInline: true,
                    muted: false,
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
            <div className={styles.chatContainer}>
              <div className={styles.chatContent} ref={chatContentRef}>
                {chatHistory.map((chat: Chat, index: number) => (
                  <div
                    key={index}
                    className={
                      chat.type === "user" ? styles.messageUser : messageClass
                    }
                  >
                    <div
                      className={
                        chat.type === "user"
                          ? styles.userMessage
                          : styles.messageSystemContent
                      }
                    >
                      {chat.message}
                      {chat.type === "user" && (
                        <div className={styles.messageSystemBottom}>
                          <span className={styles.messageTime}>
                            {messageTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {isSending && <ChatSpinner />}
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
                      transform: `rotate(${isCollapseVisible ? 180 : 0}deg)`,
                    }}
                    src={isCollapseVisible ? ArrowDown : CollapseIcon}
                    alt="icon"
                  />
                </div>
              )}
              <div className={styles.collapseContent}>
                {isCollapseVisible && <Collapse>{renderMetaData()}</Collapse>}
              </div>
              <div className={styles.chatWrap}>
                <VoiceRecorder
                  setIsRecordingInProcess={setIsRecordingInProcess}
                  addTextWithDelay={addTextWithDelay}
                  selectedLanguage=""
                  clickCursor={clickCursor}
                  setFormData={setFormData}
                  isLoadingData={false}
                  setQuestion={setQuestion}
                  link=""
                  setIsStreamConnect={setIsStreamConnect}
                  userId={value.id?.toString()}
                  selectedLanguageCode={selectedLanguage.isoCode2char}
                  indexName={indexName}
                  setIsShowSilent={setIsShowSilent}
                />
                <div className={styles.chatInputSection}>
                  <input
                    {...register("question", { required: true })}
                    type="text"
                    className={styles.chatInput}
                    placeholder={t("questionPlaceholder")}
                    autoComplete="off"
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    className={styles.submitButton}
                    disabled={isSending}
                    onClick={() => {
                      handleSubmit((data) => {
                        onSubmit(data);
                        setIsStreamConnect(true);
                      })();
                    }}
                  >
                    <img src={Send} alt="btn" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <LanguageModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            languages={languages}
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
