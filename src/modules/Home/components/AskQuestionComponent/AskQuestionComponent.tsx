import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
import { Collapse, Form } from "antd";
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
  // setIsStopQuestion,
  // setIsStreamShow,
  // setStreamDone,
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
import { Chat } from "../../containers/AskQuestionContainer";
import { stopAvatarGeneration } from "../../../../helpers/stopAvatarGeneration";
import { SrsRtcWhipWhepAsync } from "../../../../components/common/SrsPlayer/srs/srs.sdk";
import { useAuthState } from "../../../Auth/slices/auth";
// import {getLocalization} from "../../../Auth/slices/auth";
// import { useQuery } from "../../../../hooks/useQuery";
// import { useAuthState } from "../../../Auth/slices/auth";
// import {useSocket} from "../../../../hooks/useSocket";

type LanguageType = {
  id: number;
  name: string;
  isoCode2char: string;
  flag: {
    link: string;
  };
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
  clearMessages: () => void;
  messages: any;
  isLoading: boolean;
  title: string;
  metaData: any;
  avatars: any;
  setUserAvatar: (id: number) => void;
  chatHistory: Chat[];
  languages: LanguageType[];
  indexName: string;
  isChooseAvatarPage?: boolean;
  form?: any;
  submitMessage?: (params: any) => void;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  srsSdkRef: typeof SrsRtcWhipWhepAsync | any;
  setChatHistory: Dispatch<SetStateAction<Chat[]>>;
  unsubscribeFromEvent?: any;
};

const { Panel } = Collapse;

dayjs.extend(customParseFormat);

const AskQuestionComponent: React.FC<AskQuestionComponentProps> = ({
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
  form,
  submitMessage,
  videoRef,
  srsSdkRef,
  setChatHistory,
  unsubscribeFromEvent,
}) => {
  const { t } = useTranslation();
  const chatFields: any = Form.useWatch([], form);
  const { pathname } = useLocation();
  const { push } = useHistory();
  const dispatch = useDispatch();
  const value = useContext(UserContext);
  // const { register, handleSubmit, reset, setValue, watch } =
  //   useForm<FormValues>();

  // const isTextInInput = !!watch()?.question?.length;

  // console.log(isTextInInput);

  const defaultLanguage = (languages || []).find(
    (lang) => lang.name === "English"
  ) || {
    id: 0,
    name: "Select Language",
    flag: { link: NoAvatar },
    isoCode2char: "code",
  };

  const [messageClass, setMessageClass] = useState(styles.messageSystemChange);
  const [isCollapseVisible] = useState(false);
  // const videoRef = useRef<HTMLVideoElement | any>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const quillRef = useRef<ReactQuill>(null);
  const cursorPositionRef = useRef<null | number>(null);
  const [url, setUrl] = useState<any>();
  const [, setIsStreamConnect] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const { userData } = useAuthState();

  const token = TokenManager.getAccessToken();
  const currentStep = useQuery("currentStep");
  const selectedBookId = useQuery("selectedBook");

  console.log("selectedBookId", selectedBookId);
  console.log("chatHistory", chatHistory);

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

  useEffect(() => {
    if (avatars?.result?.data?.length && value) {
      // const selectedBookQuery = selectedBookId
      //   ? `&currentStep=${currentStep}`
      //   : "";
      const initialAvatarIndex = avatars?.result?.data.findIndex(
        (avatar: AvatarData) => avatar.id === value?.avatarSettings?.id
      );
      const foundIndex = initialAvatarIndex !== -1 ? initialAvatarIndex : 0;
      setInitialSlide(foundIndex);

      const initialAvatar = avatars?.result?.data[foundIndex];
      setCurrentImage(initialAvatar);
      setSelectedAvatar(initialAvatar.avatarPicture.link);

      // if (userData?.result?.avatarSettings?.id) {
      //   push(`${pathname}?currentStep=${1}`);
      // } else {
      //   const nowStep = currentStep ? currentStep : 4;
      //   push(
      //     `${pathname}?currentStep=${
      //       foundIndex === 0 ? 1 : nowStep
      //     }${selectedBookQuery}`
      //   );
      // }
    }
  }, [userData?.result?.avatarSettings?.id, value]);

  useEffect(() => {
    if (languages && languages.length > 0) {
      const englishLanguage = languages.find((lang) => lang.name === "English");
      if (englishLanguage) {
        setSelectedLanguage(englishLanguage);
      }
    }
  }, [languages]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTo(0, chatContentRef.current.scrollHeight);
    }
  }, [chatHistory.length]);

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
    // const handleRouteChange = () => {
    //   if (!location.pathname.includes("ask_question") && videoRef.current) {
    //     if (value?.id) {
    //       stopAvatarGeneration({ client_id: String(value.id) }, token);
    //     }
    //     videoRef.current.srcObject = null;
    //     setIsStreamConnect(false);
    //   }
    // };
    //
    // handleRouteChange();

    return () => {
      if (value?.id) {
        stopAvatarGeneration({ client_id: String(value.id) }, token);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

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
        selectedAvatar={userData?.result?.avatarSettings?.avatarPicture?.link}
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
                      {!title ? t("askGlobalTitle") : title}
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
                      >
                        <img
                          src={isMuted ? SoundOffIcon : SoundOnIcon}
                          alt={isMuted ? "Sound Off Icon" : "Sound On Icon"}
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
                    {chatHistory.map((chat, index) => {
                      const isLastMessage = index === chatHistory.length - 1;
                      if (!chat.message.trim()?.length) return;

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

                  {metaData && metaData.length > 0 && !isLoading && (
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
                    <Form
                      layout={"vertical"}
                      form={form}
                      style={{ width: "100%" }}
                      onFinish={submitMessage}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.keyCode === 13) {
                          e.preventDefault();
                        }
                      }}
                      onKeyUp={async (e: any) => {
                        if (
                          !isLoading &&
                          e.key === "Enter" &&
                          e.keyCode === 13 &&
                          chatFields.query
                        ) {
                          submitMessage && (await submitMessage(chatFields));
                        }
                      }}
                    >
                      <div className={styles.chatInputSection}>
                        {!recording && (
                          <Form.Item name={"query"} noStyle>
                            <input
                              type="text"
                              className={styles.chatInput}
                              placeholder={t("questionPlaceholder")}
                              autoComplete="off"
                              disabled={!isFirst}
                            />
                          </Form.Item>
                        )}

                        {chatFields?.query?.length && (
                          <button
                            type="button"
                            className={styles.clearButton}
                            onClick={() => {
                              form.setFieldValue("query", "");
                            }}
                          >
                            <img src={ClearIcon} alt="clear" />
                          </button>
                        )}
                        {chatFields?.query?.length ? (
                          <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                          >
                            <img src={Send} alt="btn" />
                          </button>
                        ) : (
                          <VoiceRecorder
                            link=""
                            addTextWithDelay={addTextWithDelay}
                            clickCursor={clickCursor}
                            isLoadingData={false}
                            setIsStreamConnect={setIsStreamConnect}
                            userId={value?.id?.toString()}
                            selectedLanguageCode={selectedLanguage.isoCode2char}
                            indexName={indexName}
                            isFirst={isFirst}
                            setIsFirst={setIsFirst}
                            setChatHistory={setChatHistory}
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
                    </Form>
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
