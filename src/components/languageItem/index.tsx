import cn from "classnames";
import styles from "./styles.module.scss";
import { Language } from "../../modules/Auth/slices/auth/types";

type Props = {
  lang: Language;
  handleLanguageSelect: (lang: Language) => void;
  defaultSelectedLanguageId: number;
};

export const LanguageItem = ({
  lang,
  handleLanguageSelect,
  defaultSelectedLanguageId,
}: Props) => (
  <div
    className={cn(styles.languageItem, {
      [styles.active]: lang?.id === defaultSelectedLanguageId,
    })}
    onClick={() => handleLanguageSelect(lang)}
  >
    <div
      className={styles.flagIcon}
      style={{ backgroundImage: `url(${lang.flag.link})` }}
    />
    <span style={{ paddingLeft: 22 }}>{lang.name}</span>
  </div>
);
