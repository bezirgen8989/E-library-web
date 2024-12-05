import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./AskQuestionComponent.module.scss";
import Avatar from "../../../../assets/images/tempAvatar.png";
import Send from "../../../../assets/images/icons/sendIcon.svg";
import { Spinner } from "../../../../components/common";

type FormValues = {
  question: string;
};

type AskQuestionComponentProps = {
  setQuestion: (text: string) => void;
  messages: any;
  isLoading: boolean;
  title: string;
};

const AskQuestionComponent: React.FC<AskQuestionComponentProps> = ({
  setQuestion,
  messages,
  title,
  isLoading,
}) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [messageClass, setMessageClass] = useState(styles.messageSystemChange);
  const [messageTime, setMessageTime] = useState<string>(""); // Время отправки
  // const [receivedTime, setReceivedTime] = useState<string>(""); // Время получения

  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onSubmit: SubmitHandler<FormValues> = (text) => {
    const currentTime = getCurrentTime(); // Время отправки
    setQuestion(text.question);
    setUserMessage(text.question);
    setMessageClass(styles.messageSystem);
    setMessageTime(currentTime);
    reset();
  };

  useEffect(() => {
    if (messages) {
      // const currentTime = getCurrentTime(); // Время получения
      // setReceivedTime(currentTime);
    }
  }, [messages]);

  return (
    <div className={styles.askQuestionPage}>
      {isLoading && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
      <div className={styles.avatarSide}>
        <div className={styles.bookTitle}>{title}</div>
        <img src={Avatar} alt="avatar" />
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.chatContent}>
          {userMessage && (
            <div className={styles.messageUser}>
              <div className={styles.userMessage}>
                <strong>Question:</strong> {userMessage}
                <div className={styles.messageSystemBottom}>
                  <span className={styles.messageTime}>{messageTime}</span>
                </div>
              </div>
            </div>
          )}
          <div className={messageClass}>
            <div className={styles.messageSystemContent}>
              {messages}
              {/*<div className={styles.messageSystemBottom}>*/}
              {/*    <span className={styles.messageTime}>{receivedTime}</span>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
        <form
          className={styles.chatInputSection}
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("question", { required: true })}
            type="text"
            className={styles.chatInput}
            placeholder="Your question..."
            autoComplete="off"
          />
          <button type="submit" className={styles.submitButton}>
            <img src={Send} alt="btn" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionComponent;
