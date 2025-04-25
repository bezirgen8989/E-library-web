import React from "react";
import { Form } from "antd";
import styles from "./SelectLang.module.scss";
import { Language } from "../../slices/auth/types";

type SelectLangProps = {
  fieldName: string;
  label: string;
  language: Language;
  onClick?: () => void;
};

const SelectLang: React.FC<SelectLangProps> = ({
  fieldName,
  label,
  onClick,
  language,
}) => {
  return (
    <Form.Item name={fieldName} noStyle>
      <div className={styles.languageSelectWrapper} onClick={onClick}>
        <label className={styles.inputLabel}>{label}</label>
        <div className={styles.inputValueBlock}>
          <div
            className={styles.languageSelect}
            style={{
              backgroundImage: `url(${language?.flag?.link})`,
            }}
          />
          <span>{language?.name}</span>
        </div>
      </div>
    </Form.Item>
  );
};

export default SelectLang;
