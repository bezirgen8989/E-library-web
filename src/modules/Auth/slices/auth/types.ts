import { ApiPayload } from "types/api";

export type AuthState = {
  loginRequest: ApiPayload<string>;
  userLoginRequest: ApiPayload<string>;
  confirmEmailRequest: any;
  categories?: any;
  userData: UserData | any;
  editUserData?: any;
  recoverData?: any;
  changePasswordData?: any;
  verifyToken?: any;
  id?: string;
  habits?: any;
  languages?: any;
  profileInfo?: any;
  photoId?: any;
  currentEmail?: any;
  googleTokenId?: any;
  avatarSettings?: any;
  aboutOptions: any;
  appLocalization?: any;
};

export type VerifyData = {
  new_password: string;
  confirm: string;
};

export type UserData = {
  isLoading: boolean;
  result: User | null;
};

export interface FileEntity {
  id: string;
  prefix: string;
  postfix: string;
  name: string;
  type: string;
  fileType: string;
  fileSize: number;
  tag: string | null;
  link: string;
}

export interface Language {
  id: number;
  name: string;
  englishName: string;
  isoCode: string;
  isoCode2char: string;
  flag: FileEntity;
}

export interface Status {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface NotificationSettings {
  id: number;
  startReading: boolean;
  continueReading: boolean;
  newBooks: boolean;
}

export interface AvatarSettings {
  id: number;
  name: string;
  createdAt: string;
  avatarMiniature: FileEntity;
  avatarPicture: FileEntity;
}

export interface User {
  id: number;
  email: string;
  provider: string;
  socialId: string | null;
  userName: string | null;
  dateBirth: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedBooks: number;
  gender: "male" | "female" | string;
  kidsMode: boolean;
  language: Language;
  bookLanguage: Language;
  photo: string | null;
  status: Status;
  role: Role;
  readingHabits: any[]; // укажи точный тип, если есть
  notificationSettings: NotificationSettings;
  avatarSettings: AvatarSettings;
}
