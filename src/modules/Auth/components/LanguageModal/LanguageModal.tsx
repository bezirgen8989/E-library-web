import commonStyles from "../../../../assets/css/commonStyles/CommonStyles.module.scss";
import Close from "../../../../assets/images/icons/Close.svg";
import { Input, Modal } from "antd";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import Button from "../../../../components/common/Buttons/Button";
import { FC, useState } from "react";

interface LanguageModalProps {
  isModalOpen: any;
  setIsModalOpen: any;
  languages: any;
  defaultLanguage: any;
  onLanguageSelect: any;
}
type LanguageType = {
  id: number;
  name: string;
  flag: {
    link: string;
  };
};

const LanguageModal: FC<LanguageModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  languages,

  defaultLanguage,
  onLanguageSelect,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [searchTerm, setSearchTerm] = useState("");
  const hideModal = () => {
    setIsModalOpen(false); // исправлено: закрытие окна
    setSearchTerm("");
  };

  const handleLanguageSelect = (lang: LanguageType) => {
    setSelectedLanguage(lang);
    onLanguageSelect(lang);
    hideModal();
  };

  const filteredLanguages = languages?.filter((lang: LanguageType) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      title={<div className="custom-modal-title">Select language</div>}
      visible={isModalOpen}
      onOk={hideModal}
      onCancel={hideModal}
      className="custom-modal"
      footer={null}
      closeIcon={
        <img className={commonStyles.modalCloseIcon} src={Close} alt="close" />
      }
    >
      <Input
        placeholder="Search"
        prefix={<img src={Search} alt="search" />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={commonStyles.searchInput}
      />

      <div className={commonStyles.languageList}>
        {filteredLanguages &&
          filteredLanguages?.map((lang: LanguageType) => (
            <div
              key={lang.id}
              className={`${commonStyles.languageItem} ${
                lang.name === selectedLanguage.name ? commonStyles.active : ""
              }`}
              onClick={() => handleLanguageSelect(lang)}
            >
              <div
                className={commonStyles.flagIcon}
                style={{
                  backgroundImage: `url(${lang.flag.link})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "140%",
                }}
              ></div>
              <span style={{ paddingLeft: 22 }}>{lang.name}</span>
            </div>
          ))}
      </div>

      <div style={{ textAlign: "right" }}>
        <Button variant="Brown" onClick={hideModal}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default LanguageModal;
