import styles from "./ProfileUserForm.module.scss";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import NoAvatar from "../../../../assets/images/icons/uploadBg.png";
import LanguageModal from "../../../Auth/components/LanguageModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    // formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      language: defaultLanguage.name,
    },
  });

  useEffect(() => {
    if (languages.length > 0) {
      const englishLanguage = languages.find((lang) => lang.name === "English");
      if (englishLanguage) {
        setSelectedLanguage(englishLanguage);
        setValue("language", englishLanguage.name);
      }
    }
  }, [languages, setValue]);

  const onLanguageSelect = (language: LanguageType) => {
    setSelectedLanguage(language);
    setValue("language", language.name);
  };

  const showModal = () => {
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
      gender: data.gender,
    };
    console.log("profileFormattedData", formattedData);
    onSubmit(formattedData);
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
                )}
              />
              <label className={styles.inputLabel}>Preferred Language</label>
            </div>
          )}
        </div>
      </form>
      <div style={{ height: "58px", width: "100%" }} />
      <LanguageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        languages={languages}
        defaultLanguage={defaultLanguage}
        onLanguageSelect={onLanguageSelect}
      />
    </div>
  );
};

export default ProfileUserForm;
