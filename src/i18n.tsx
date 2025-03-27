import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend, { HttpBackendOptions } from "i18next-http-backend";
import { API_PREFIX } from "api/apiHelpers";
import * as jsonEn from "./locales/en/common.json";

type TTranslations = { [key: string]: any };

type I18NextHttpBackendRequestOptions = {
  lng?: string;
  ns?: string | string[];
  addPath?: string;
  multiSeparator?: string;
  allowMultiLoading?: boolean;
  parse?: (data: string, languages?: string | string[]) => TTranslations;
  stringify?: (data: TTranslations) => string;
  requestOptions?: any;
};

type I18NextHttpBackendRequestCallback = (
  error: Error | null,
  result: { status: number; data: string } | null
) => void;

const resources: TTranslations = {
  en: jsonEn,
};

const fallbackLng = "en";
const defaultLng = localStorage.getItem("i18nextLng") ?? fallbackLng;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    lng: defaultLng,
    backend: {
      loadPath: `${API_PREFIX}/api/v1/localization/web/{{lng}}`,

      request: (
        options: I18NextHttpBackendRequestOptions,
        url: string,
        payload: Record<string, any> | string | null,
        callback: I18NextHttpBackendRequestCallback
      ) => {
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to load translations: ${response.status}`
              );
            }
            return response.text();
          })
          .then((data) => callback(null, { status: 200, data }))
          .catch((error) => {
            console.error(
              "Failed to fetch translations, using local resources:",
              error
            );
            const localTranslations = JSON.stringify(
              resources[options.lng || defaultLng] || {}
            );
            callback(null, { status: 200, data: localTranslations });
          });
      },

      parse: (data: string, languages?: string | string[]): TTranslations => {
        const mergeDeep = (target: any, source: any): any => {
          for (const key in source) {
            if (
              source[key] &&
              typeof source[key] === "object" &&
              !Array.isArray(source[key])
            ) {
              target[key] = mergeDeep(target[key] || {}, source[key]);
            } else {
              target[key] = source[key];
            }
          }
          return target;
        };

        if (data && languages) {
          const parsedData = JSON.parse(data);

          if (typeof languages === "string") {
            const baseTranslations = resources[languages] || {};
            return mergeDeep({ ...baseTranslations }, parsedData);
          }

          if (Array.isArray(languages)) {
            const mergedTranslations = languages.reduce((acc) => {
              return mergeDeep(acc, resources[defaultLng] || {});
            }, {});
            return mergeDeep(mergedTranslations, parsedData);
          }
        }

        return resources[defaultLng] || {};
      },
    },
    fallbackLng: defaultLng,
    debug: false,
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
  });

export default i18n;
