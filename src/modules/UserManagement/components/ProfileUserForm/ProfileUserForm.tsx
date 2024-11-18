import styles from "./ProfileUserForm.module.scss";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import NoAvatar from "../../../../assets/images/icons/uploadBg.png";
import tempAi from "../../../../assets/images/testAiImg.png";
import LanguageModal from "../../../Auth/components/LanguageModal";
import { Switch } from "antd";

export type LanguageType = {
  id: number;
  name: string;
  flag: {
    link: string;
  };
};

type RecoverProps = {
  onSubmit: (values: any) => void;
  languages: LanguageType[];
};

type FormValues = {
  userName: string;
  dateBirth: string;
  language: string;
  bookLanguage: string;
  gender: string;
  photo: any;
};

const ProfileUserForm: React.FC<RecoverProps> = ({
  onSubmit,
  languages = [],
}) => {
  const defaultLanguage = languages.find((lang) => lang.name === "English") || {
    id: 0,
    name: "Select Language",
    flag: { link: NoAvatar },
  };
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [selectedBookLanguage, setSelectedBookLanguage] =
    useState(defaultLanguage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"language" | "bookLanguage">(
    "language"
  );
  const {
    control,
    handleSubmit,
    setValue,
    // formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      language: defaultLanguage.name,
      bookLanguage: defaultLanguage.name,
    },
  });

  useEffect(() => {
    if (languages.length > 0) {
      const englishLanguage = languages.find((lang) => lang.name === "English");
      if (englishLanguage) {
        setSelectedLanguage(englishLanguage);
        setSelectedBookLanguage(englishLanguage);
        setValue("language", englishLanguage.name);
        setValue("bookLanguage", englishLanguage.name);
      }
    }
  }, [languages, setValue]);

  const onLanguageSelect = (language: LanguageType) => {
    if (modalType === "language") {
      setSelectedLanguage(language);
      setValue("language", language.name);
    } else if (modalType === "bookLanguage") {
      setSelectedBookLanguage(language);
      setValue("bookLanguage", language.name);
    }
  };

  const showModal = (type: "language" | "bookLanguage") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const onSubmitForm = (data: FormValues) => {
    console.log("profileForm", data);
    const formattedData = {
      userName: data.userName,
      dateBirth: data.dateBirth,
      language: {
        id: selectedLanguage.id,
      },
      bookLanguage: {
        id: selectedBookLanguage.id,
      },
      gender: data.gender,
    };
    console.log("profileFormattedData", formattedData);
    onSubmit(formattedData);
  };

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div style={{ marginTop: 15 }}>
          {languages.length > 0 && (
            <div className={styles.inputWrapperLang}>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      showModal("language");
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
                )}
              />
              <label className={styles.inputLabel}>App Language</label>
            </div>
          )}
        </div>
        <div style={{ marginTop: 15 }}>
          {languages.length > 0 && (
            <div className={styles.inputWrapperLang}>
              <Controller
                name="bookLanguage"
                control={control}
                render={({ field }) => (
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      showModal("bookLanguage");
                    }}
                    className={styles.languageSelectWrapper}
                  >
                    <div
                      className={styles.languageSelect}
                      style={{
                        backgroundImage: `url(${selectedBookLanguage.flag.link})`,
                      }}
                    ></div>
                    <span>{selectedBookLanguage.name}</span>
                  </div>
                )}
              />
              <label className={styles.inputLabel}>Book Language</label>
            </div>
          )}
        </div>
        <div className={styles.kidsSelectWrapper}>
          <span>Kids Mode</span>
          <Switch onChange={onChange} />
        </div>
        <div className={styles.aiWrapper}>
          <div className={styles.aiAvatar}>
            <img src={tempAi} alt="avatar" />
          </div>
          <span>AI Librarian</span>
        </div>
        {/*<Button variant="White" type="submit">*/}
        {/*    Continue*/}
        {/*</Button>*/}
      </form>
      <div style={{ height: "58px", width: "100%" }} />
      <LanguageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        languages={languages}
        defaultLanguage={
          modalType === "language" ? selectedLanguage : selectedBookLanguage
        }
        onLanguageSelect={onLanguageSelect}
      />
    </div>
  );
};

export default ProfileUserForm;
