import { FC, useMemo } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import commonStyles from "../../../../assets/css/commonStyles/CommonStyles.module.scss";
import Close from "../../../../assets/images/icons/Close.svg";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import { getLanguages, useAuthState } from "../../slices/auth";
import { Language } from "../../slices/auth/types";
import cn from "classnames";

interface LanguageModalProps {
  isModalOpen: boolean;
  closeModal?: () => void;
  setIsModalOpen?: any;
  onLanguageSelect: (lang: Language) => void;
  currentSelectedLanguage?: Language;
  modalType?: string;
}

const LanguageModal: FC<LanguageModalProps> = ({
  isModalOpen,
  closeModal,
  currentSelectedLanguage,
  onLanguageSelect,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchTerm = Form.useWatch("searchedLangName", form);
  const { languages: storedLanguages } = useAuthState();

  const languages = storedLanguages.result?.data;

  useMemo(() => {
    if (!storedLanguages.result?.data?.length) {
      return dispatch(getLanguages());
    }
    return [];
  }, []);

  const handleLanguageSelect = async (lang: Language) => {
    onLanguageSelect(lang);
  };

  const filteredLanguages = languages?.filter((lang: Language) =>
    lang.name.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <Modal
      title={
        <div className={commonStyles.selectLangModalHeader}>
          <div className="custom-modal-title">{t("selectLanguage")}</div>
          <img src={Close} alt="close" onClick={closeModal} />
        </div>
      }
      closable={false}
      open={isModalOpen}
      onOk={closeModal}
      onCancel={closeModal}
      className="custom-modal"
      footer={null}
    >
      <Form
        name={"Search language form"}
        form={form}
        initialValues={{
          searchedLangName: "",
        }}
      >
        <Form.Item name={"searchedLangName"} noStyle>
          <Input
            placeholder={t("menuItemSearch")}
            bordered={false}
            prefix={<img src={Search} alt="search" />}
            className={commonStyles.searchInput}
          />
        </Form.Item>
      </Form>

      <div className={commonStyles.languageList}>
        {/* Official Translations */}
        {filteredLanguages?.some((lang: any) => lang.translationType) ? (
          <>
            <span style={{ fontWeight: 600, fontSize: "22px" }}>
              Official Translations
            </span>
            <div>
              {filteredLanguages
                ?.filter((lang: any) => lang.translationType === "official")
                .map((lang: Language) => (
                  <div
                    key={lang.id}
                    className={cn(commonStyles.languageItem, {
                      [commonStyles.active]:
                        lang?.name === currentSelectedLanguage?.name,
                    })}
                    onClick={() => handleLanguageSelect(lang)}
                  >
                    <div
                      className={commonStyles.flagIcon}
                      style={{ backgroundImage: `url(${lang.flag.link})` }}
                    />
                    <span style={{ paddingLeft: 22 }}>{lang.name}</span>
                  </div>
                ))}
            </div>
            <div className={commonStyles.divider}></div>

            {/* AI-Generated Translations */}
            <span style={{ fontWeight: 600, fontSize: "22px" }}>
              AI-Generated Translations
            </span>
            <div>
              {filteredLanguages
                ?.filter((lang: any) => lang.translationType === "ai")
                .map((lang: Language) => (
                  <div
                    key={lang.id}
                    className={cn(commonStyles.languageItem, {
                      [commonStyles.active]:
                        lang?.name === currentSelectedLanguage?.name,
                    })}
                    onClick={() => handleLanguageSelect(lang)}
                  >
                    <div
                      className={commonStyles.flagIcon}
                      style={{ backgroundImage: `url(${lang.flag.link})` }}
                    />
                    <span style={{ paddingLeft: 22 }}>{lang.name}</span>
                  </div>
                ))}
            </div>
          </>
        ) : (
          // If there's no translationType field, render languages without filtering
          <div>
            {filteredLanguages?.map((lang: Language) => (
              <div
                key={lang?.id}
                className={cn(commonStyles.languageItem, {
                  [commonStyles.active]:
                    lang?.name === currentSelectedLanguage?.name,
                })}
                onClick={() => handleLanguageSelect(lang)}
              >
                <div
                  className={commonStyles.flagIcon}
                  style={{ backgroundImage: `url(${lang.flag.link})` }}
                />
                <span style={{ paddingLeft: 22 }}>{lang?.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={commonStyles.primaryModalBtn}>
        <Button onClick={closeModal}>{t("backBtn")}</Button>
      </div>
    </Modal>
  );
};

export default LanguageModal;
