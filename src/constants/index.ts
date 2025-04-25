// import { ThreadType } from '@types';

import { Language } from "../modules/Auth/slices/auth/types";

export const eventColors = [
  "#F5222D",
  "#FA8C16",
  "#8BBB11",
  "#52C41A",
  "#13A8A8",
  "#1677FF",
  "#2F54EB",
  "#722ED1",
  "#EB2F96",
];

export const dateFormats = {
  DMY: "DD/MM/YYYY",
  DMYDot: "DD.MM.YYYY",
  DMYHms: "DD/MM/YYYY HH:mm:ss",
  YMD: "YYYY/MM/DD",
  MDY: "MM/DD/YYYY",
};

export const recharsSampleData = [
  {
    name: "SampleA",
    a: 4000,
    b: 2400,
    c: 2400,
  },
  {
    name: "SampleB",
    a: 3000,
    b: 1398,
    c: 2210,
  },
  {
    name: "SampleC",
    a: 2000,
    b: 9800,
    c: 2290,
  },
  {
    name: "SampleD",
    a: 2780,
    b: 3908,
    c: 2000,
  },
  {
    name: "SampleE",
    a: 1890,
    b: 4800,
    c: 2181,
  },
  {
    name: "SampleF",
    a: 2390,
    b: 3800,
    c: 2500,
  },
  {
    name: "SampleG",
    a: 3490,
    b: 4300,
    c: 2100,
  },
];

export const defaultEnglishLanguage: Language = {
  id: 7,
  name: "English",
  englishName: "English",
  isoCode: "eng",
  isoCode2char: "en",
  flag: {
    id: "3d91e520-23bb-425b-96a7-37d137c29e5b",
    prefix: "languageicons",
    postfix: "flags",
    name: "united-kingdom@2x.png",
    type: "FILE",
    fileType: "image/png",
    fileSize: 2636007,
    tag: "",
    link: "https://elore.sfo3.cdn.digitaloceanspaces.com/languageicons/flags/united-kingdom@2x.png",
  },
};

export const defaultDataFormat = dateFormats.DMY;
export const tablePageSize = 10;
export const COMMENTS_PAGE_SIZE = 10;
export const COMMENTS_REVIEWS_PAGE_SIZE = 5;
// export const DEFAULT_THREAD = ThreadType.Tasks;
export const CHAT_MESSAGES_PAGESIZE = 20;
export const CHAT_CONVERSATIONS_PAGESIZE = 20;
export const SURVEY_STORAGE = "survey-json";

export const CHROME_EXTENSION_LINK =
  "https://chromewebstore.google.com/detail/td-accessibility-adapter/gojenooamlnamkmglonclikkdnakpjoe";
