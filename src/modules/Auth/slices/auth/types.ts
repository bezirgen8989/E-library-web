import { ApiPayload } from "types/api";

export type AuthState = {
  loginRequest: ApiPayload<string>;
  userLoginRequest: ApiPayload<string>;
  confirmEmailRequest: any;
  categories?: any;
  userData?: any;
  editUserData?: any;
  recoverData?: any;
  changePasswordData?: any;
  verifyToken?: any;
  id?: string;
  habits?: any;
  kidsMode?: any;
  languages?: any;
  profileInfo?: any;
  photoId?: any;
  currentEmail?: any;
  googleTokenId?: any;
  avatarSettings?: any;
};

export type VerifyData = {
  new_password: string;
  confirm: string;
};
