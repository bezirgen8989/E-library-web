import { useMemo } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import commonStyles from "../../../../assets/css/commonStyles/CommonStyles.module.scss";
import Close from "../../../../assets/images/icons/Close.svg";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import { getLanguages, useAuthState } from "../../slices/auth";
import { Language } from "../../slices/auth/types";
import { RegularLanguages } from "./regularLanguages";
import { BookLanguages } from "./bookLanguages";
import { LanguageItem } from "../../../../components/languageItem";
import { useHomeState } from "../../../Home/slices/home";
import { BookItem } from "../../../Home/slices/home/types";

interface LanguageModalProps {
  isModalOpen: boolean;
  closeModal?: () => void;
  setIsModalOpen?: any;
  onLanguageSelect: (lang: Language) => void;
  currentSelectedLanguage: Language;
  modalType?: string;
  languageSelectType?: "regular" | "book";
}

const LanguageModal = ({
  isModalOpen,
  closeModal,
  currentSelectedLanguage,
  onLanguageSelect,
  languageSelectType = "regular",
}: LanguageModalProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchTerm = Form.useWatch("searchedLangName", form);
  const { languages: storedLanguages } = useAuthState();
  const { bookVersions } = useHomeState();
  const bookLanguages = bookVersions.result?.data;
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

  const filteredLanguages =
    languageSelectType === "regular"
      ? languages?.filter((lang: Language) =>
          lang.name.toLowerCase().includes(searchTerm?.toLowerCase())
        )
      : bookLanguages?.filter((lang: BookItem) =>
          lang.language.name.toLowerCase().includes(searchTerm?.toLowerCase())
        );

  const languageListComponent = {
    regular: (
      <RegularLanguages
        defaultSelectedLanguageId={currentSelectedLanguage?.id}
        handleLanguageSelect={handleLanguageSelect}
        languages={languages}
      />
    ),
    book: (
      <BookLanguages
        defaultSelectedLanguageId={currentSelectedLanguage?.id}
        handleLanguageSelect={handleLanguageSelect}
        bookLanguages={bookLanguages}
      />
    ),
  };

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
        {searchTerm
          ? filteredLanguages?.map((item: Language | BookItem | any) => (
              <LanguageItem
                key={item.id}
                lang={item.language ? item.language : item}
                defaultSelectedLanguageId={currentSelectedLanguage?.id}
                handleLanguageSelect={handleLanguageSelect}
              />
            ))
          : languageListComponent[
              languageSelectType as keyof typeof languageListComponent
            ]}
      </div>

      <div className={commonStyles.primaryModalBtn}>
        <Button onClick={closeModal}>{t("backBtn")}</Button>
      </div>
    </Modal>
  );
};

export default LanguageModal;
