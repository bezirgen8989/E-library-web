import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./AskQuestionComponent.module.scss";
import Avatar from "../../../../assets/images/tempAvatar.png";
import Send from "../../../../assets/images/icons/sendIcon.svg";
import SSEComponent from "../common/SSEComponent/SSEComponent";

type FormValues = {
  question: string;
};

type AskQuestionComponentProps = {
  // onSubmitQuestion: (text: string) => void;
};

const AskQuestionComponent: React.FC<AskQuestionComponentProps> = ({}) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [question, setQuestion] = useState("");

  const onSubmit: SubmitHandler<FormValues> = (text) => {
    setQuestion(text.question);
    reset();
  };

  return (
    <div className={styles.askQuestionPage}>
      <div className={styles.avatarSide}>
        <img src={Avatar} alt="avatar" />
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.chatContent}>
          <div className={styles.messageSystem}>
            <div className={styles.messageSystemContent}>
              <SSEComponent question={question} />
              <div className={styles.messageSystemBottom}>
                <div className={styles.readMoreBtn}>Read More</div>
                <span className={styles.messageTime}>11:45</span>
              </div>
            </div>
          </div>

          <div className={styles.messageUser}>
            <div className={styles.userMessage}>
              <strong>One Thousand and One Nights (Arabian Nights):</strong>{" "}
              This is perhaps the most famous collection of Middle Eastern folk
              tales. It includes stories like Aladdin, Ali Baba and the Forty
              Thieves, and Sinbad the Sailor...
              <div className={styles.messageSystemBottom}>
                <div className={styles.readMoreBtn}>Read More</div>
                <span className={styles.messageTime}>11:45</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form for question submission */}
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
