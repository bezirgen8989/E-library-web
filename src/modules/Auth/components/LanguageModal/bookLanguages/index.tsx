import { Language } from "../../../slices/auth/types";
import commonStyles from "../../../../../assets/css/commonStyles/CommonStyles.module.scss";
import { LanguageItem } from "../../../../../components/languageItem";
import { useMemo } from "react";
import { Typography } from "antd";
import { BookItem } from "../../../../Home/slices/home/types";

type Props = {
  defaultSelectedLanguageId: number;
  handleLanguageSelect: (lang: Language) => void;
  bookLanguages: BookItem[] | undefined;
};

export const BookLanguages = ({
  defaultSelectedLanguageId,
  handleLanguageSelect,
  bookLanguages,
}: Props) => {
  const { official, ai } = useMemo(
    () => ({
      official: bookLanguages?.filter(
        (lang) => lang.translationType === "official"
      ),
      ai: bookLanguages?.filter((lang) => lang.translationType === "ai"),
    }),
    [bookLanguages]
  );

  return (
    <div>
      <>
        <Typography style={{ fontWeight: 600, fontSize: "22px" }}>
          Official Translations
        </Typography>
        <div>
          {official?.map((lang) => (
            <LanguageItem
              key={lang.id}
              lang={lang.language}
              defaultSelectedLanguageId={defaultSelectedLanguageId}
              handleLanguageSelect={handleLanguageSelect}
            />
          ))}
        </div>
        <div className={commonStyles.divider}></div>

        <Typography style={{ fontWeight: 600, fontSize: "22px" }}>
          AI-Generated Translations
        </Typography>
        <div>
          {ai?.map((lang) => (
            <LanguageItem
              key={lang.id}
              lang={lang.language}
              defaultSelectedLanguageId={defaultSelectedLanguageId}
              handleLanguageSelect={handleLanguageSelect}
            />
          ))}
        </div>
      </>
    </div>
  );
};
