import { useState, useMemo } from "react";
import { Form, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import NotificationsModal from "../common/NotificationModal/NotificationsModal";
import LanguageModal from "../../../Auth/components/LanguageModal";
import {
  setAppLanguage,
  setBookLanguage,
  setKidsMode,
  useAuthState,
} from "../../../Auth/slices/auth";
import { AvatarSettings, Language } from "modules/Auth/slices/auth/types";
import SelectLang from "../../../Auth/components/SelectLang/SelectLang";
import tempAi from "../../../../assets/images/testAiImg.png";

import styles from "./ProfileUserForm.module.scss";
import { useHistory } from "react-router-dom";

type LanguageInputs = {
  appLanguage: Language;
  bookLanguage: Language;
  kidsMode: boolean;
  currentUserAvatar: AvatarSettings;
};

type LanguageModalTypes = "language" | "bookLanguage";

const ProfileUserForm = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { userData } = useAuthState();
  const [modalType, setModalType] = useState<LanguageModalTypes | null>(null);

  const { appLanguage, bookLanguage, kidsMode, currentUserAvatar } =
    useMemo<LanguageInputs>(() => {
      return {
        appLanguage: userData?.result?.language,
        bookLanguage: userData?.result?.bookLanguage,
        kidsMode: userData?.result?.kidsMode,
        currentUserAvatar: userData?.result?.avatarSettings,
      };
    }, [userData]);

  const showModal = (type: "language" | "bookLanguage") => {
    setModalType(type);
  };

  const onHandleSave = async (value: any) => {
    const changedInputKey = Object.keys(value)[0];
    if (changedInputKey === "kidsMode") {
      dispatch(setKidsMode({ kidsMode: value.kidsMode }));
    }
  };

  const closeLangModalHandler = () => {
    setModalType(null);
  };

  const onSelectLanguage = (language: Language) => {
    if (modalType === "language") {
      dispatch(setAppLanguage({ language }));
    }
    if (modalType === "bookLanguage") {
      dispatch(setBookLanguage({ bookLanguage: language }));
    }
  };
  const goToSelectAvatarPage = () => {
    push("/choose_avatar");
  };

  return (
    <>
      <NotificationsModal
        isModalOpen={isNotificationsModalOpen}
        setIsModalOpen={setIsNotificationsModalOpen}
      />
      <LanguageModal
        isModalOpen={!!modalType?.length}
        closeModal={closeLangModalHandler}
        currentSelectedLanguage={
          modalType === "language" ? appLanguage : bookLanguage
        }
        onLanguageSelect={onSelectLanguage}
      />
      <Form
        name={"User profile form"}
        form={form}
        className={styles.profileForm}
        onValuesChange={onHandleSave}
        initialValues={{
          appLanguage: appLanguage?.name,
          bookLanguage: bookLanguage?.name,
          kidsMode,
          notifications: "",
          avatarSettings: {},
        }}
      >
        <SelectLang
          label={t("appLanguage")}
          fieldName={"appLang"}
          language={appLanguage}
          onClick={() => showModal("language")}
        />
        <SelectLang
          label={t("bookLanguage")}
          fieldName={"bookLang"}
          language={bookLanguage}
          onClick={() => showModal("bookLanguage")}
        />

        <div className={styles.kidsSelectWrapper}>
          <label>{t("kidsMode")}</label>
          <Form.Item name={"kidsMode"} valuePropName={"checked"} noStyle>
            <Switch />
          </Form.Item>
        </div>

        <Form.Item name={"notifications"} noStyle>
          <div
            className={styles.aiWrapper}
            onClick={() => {
              setIsNotificationsModalOpen(true);
            }}
          >
            <span>{t("notificationSettings")}</span>
          </div>
        </Form.Item>

        <Form.Item name={"avatarSettings"} noStyle>
          <button
            type={"button"}
            className={styles.aiWrapper}
            onClick={goToSelectAvatarPage}
          >
            <div className={styles.aiAvatar}>
              <img
                src={currentUserAvatar?.avatarMiniature?.link || tempAi}
                alt={`Selected Avatar ${currentUserAvatar?.avatarMiniature?.name}`}
              />
            </div>
            <span>{currentUserAvatar?.name || t("aILibrarian")}</span>
          </button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProfileUserForm;
