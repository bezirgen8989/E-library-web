import { Language } from "../../../slices/auth/types";
import { LanguageItem } from "../../../../../components/languageItem";

type Props = {
  defaultSelectedLanguageId: number;
  handleLanguageSelect: (lang: Language) => void;
  languages: Language[] | undefined;
};

export const RegularLanguages = ({
  defaultSelectedLanguageId,
  handleLanguageSelect,
  languages,
}: Props) => (
  <div>
    {languages?.map((lang: Language) => (
      <LanguageItem
        key={lang.id}
        lang={lang}
        defaultSelectedLanguageId={defaultSelectedLanguageId}
        handleLanguageSelect={handleLanguageSelect}
      />
    ))}
  </div>
);
