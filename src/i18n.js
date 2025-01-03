import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend) // Подключение backend для загрузки переводов
  .use(LanguageDetector) // Определение языка пользователя
  .use(initReactI18next) // Интеграция с React
  .init({
    fallbackLng: "en", // Язык по умолчанию
    debug: true, // Отладка (включить в разработке)
    interpolation: {
      escapeValue: false, // React сам экранирует HTML
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Путь к файлам с переводами
    },
    ns: ["common"], // Неймспейсы для модульности переводов
    defaultNS: "common",
  });

export default i18n;
