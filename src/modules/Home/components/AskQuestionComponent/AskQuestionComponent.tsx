import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Collapse } from "antd";
import styles from "./AskQuestionComponent.module.scss";
import Send from "../../../../assets/images/icons/sendIcon.svg";
import CollapseIcon from "../../../../assets/images/icons/CollapseIcon.svg";
import DocumentIcon from "../../../../assets/images/icons/document.svg";
import ArrowDown from "../../../../assets/images/icons/arrowProfile.svg";
import Mic from "../../../../assets/images/icons/MicIcon.svg";
import ChatSpinner from "../../../../components/common/ChatSpinner";
// import { SrsPlayer } from "../../../../components/common/SrsPlayer";
import ReactQuill from "react-quill";
import ChooseAvatar from "./common/ChooseAvatar/ChooseAvatar";
import ChooseAvatarStep2 from "./common/ChooseAvatarStep2/ChooseAvatarStep2";
import ChooseAvatarStep3 from "./common/ChooseAvatarStep3/ChooseAvatarStep3";
import ChooseAvatarStep4 from "./common/ChooseAvatarStep4/ChooseAvatarStep4";
import VoiceRecorder from "../../../../components/Voice/VoiceRecorder/VoiceRecorder";

type Chat = {
  type: "user" | "system"; // Assuming 'user' or 'system' are the only types of messages
  message: string;
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
}) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [messageClass, setMessageClass] = useState(styles.messageSystemChange);
  const [messageTime, setMessageTime] = useState<string>("");
  const [isCollapseVisible, setIsCollapseVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // const videoRef = useRef<HTMLVideoElement | any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [isRecordingInProcess, setIsRecordingInProcess] = useState(false);
  const [formData, setFormData] = useState<FormData | undefined>();
  const quillRef = useRef<ReactQuill>(null);
  const cursorPositionRef = useRef<null | number>(null);
  const [isTextMode, setIsTextMode] = useState(false);
  console.log("formData", formData);
  console.log("isRecordingInProcess", isRecordingInProcess);

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
    setQuestion(data.question);
    clearMessages();
    // setUserMessage(data.question);
    setMessageClass(styles.messageSystem);
    setMessageTime(currentTime);
    setIsSending(true);
    reset();

    setTimeout(() => {
      setIsSending(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTextMode(e.target.value.length > 0); // Switch to text mode if there is any input
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
      return metaData.map((item: any, index: number) => (
        <Panel
          key={index}
          header={
            <div className={styles.panelHeader}>
              <img
                src={DocumentIcon}
                alt="Document Icon"
                className={styles.documentIcon}
              />
              <span>Page {item.meta.loc.pageNumber}</span>
            </div>
          }
          showArrow={false} // Убираем стандартный значок разворачивания
        >
          <div>
            <p>
              <strong>Location:</strong> Page {item.meta.loc.pageNumber}, Lines{" "}
              {item.meta.loc.lines.from}-{item.meta.loc.lines.to}
            </p>
            <p>
              <strong>Content Excerpt:</strong> {item.content.substring(0, 300)}
              ...
            </p>
          </div>
        </Panel>
      ));
    }
    return null;
  };

  const toggleCollapse = () => {
    setIsCollapseVisible(!isCollapseVisible);
  };

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
        <div className={styles.askQuestionPage}>
          <div className={styles.avatarSide}>
            <div className={styles.bookTitle}>
              {location.pathname.includes("ask_global_question")
                ? "Global Library Collection"
                : title}
            </div>
            <div
              className={styles.avatarFace}
              style={{ backgroundImage: `url(${selectedAvatar})` }}
            />
            {/*<SrsPlayer*/}
            {/*    url="https://avatars.plavno.app:1990/rtc/v1/whep/?app=live&stream=livestream"*/}
            {/*  // url="https://avatars.plavno.app:1990/rtc/v1/whep/?app=live&stream=livestream-a"*/}
            {/*  width={300}*/}
            {/*  height={100}*/}
            {/*  videoRef={videoRef}*/}
            {/*  options={{*/}
            {/*    autoPlay: true,*/}
            {/*    playsInline: true,*/}
            {/*    muted: false,*/}
            {/*    controls: true,*/}
            {/*  }}*/}
            {/*  rtcOpts={{*/}
            {/*    audio: {*/}
            {/*      enable: true,*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
            {/*{metaData && metaData.length > 0 && !isLoading && !isSending && (*/}
            {/*  <div onClick={toggleCollapse}>*/}
            {/*    {isCollapseVisible ? "Hide used resources" : "Show used resources"}*/}
            {/*  </div>*/}
            {/*)}*/}
            {/*{isSending && <ChatSpinner />}*/}
            {/*{isCollapseVisible && <Collapse>{renderMetaData()}</Collapse>}*/}
          </div>
          <div className={styles.chatContainer}>
            <div className={styles.chatContent}>
              {chatHistory.map((chat: Chat, index: number) => (
                <div
                  key={index}
                  className={
                    chat.type === "user" ? styles.messageUser : messageClass // Use messageClass for system messages
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

            {/*{isLoading && (*/}
            {/*  <div className={styles.spinnerContainer}>*/}
            {/*    <ChatSpinner />*/}
            {/*  </div>*/}
            {/*)}*/}

            {isSending && <ChatSpinner />}
            {metaData && metaData.length > 0 && !isLoading && !isSending && (
              <div className={styles.collapseButton} onClick={toggleCollapse}>
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

            <div className={styles.chatInputSection}>
              <input
                {...register("question", { required: true })}
                type="text"
                className={styles.chatInput}
                placeholder="Your question..."
                autoComplete="off"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              {isTextMode ? (
                <button
                  type="button"
                  className={styles.submitButton}
                  disabled={isSending}
                  onClick={handleSubmit(onSubmit)}
                >
                  <img src={Send} alt="btn" />
                </button>
              ) : (
                <button className={styles.micButton} disabled={isSending}>
                  <img src={Mic} alt="btn" />
                </button>
              )}
            </div>
            <VoiceRecorder
              setIsRecordingInProcess={setIsRecordingInProcess}
              addTextWithDelay={addTextWithDelay}
              selectedLanguage=""
              clickCursor={clickCursor}
              setFormData={setFormData}
              // isLoadingData={!isCreate && queryResult?.isLoading}
              isLoadingData={false}
              // link={formProps?.initialValues?.audioFile?.link}
              link=""
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AskQuestionComponent;
