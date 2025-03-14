import {
  usingDelete,
  usingGet,
  usingPatch,
  usingPost,
  usingPut,
} from "api/apiHelpers";
import {
  confirmationParamsProps,
  ConfirmParams,
  EditUserParams,
  GoogleLoginUserParams,
  LoginUserParams,
  RecoverData,
  RegisterUserParams,
  TokenData,
} from "modules/Auth/types";

export const authLogin = (formParams: LoginUserParams) =>
  usingPost("/api/v1/auth/email/login", formParams);
export const authGoogleLogin = (formParams: GoogleLoginUserParams) =>
  usingPost("/api/v1/auth/google/login", formParams);
export const authRegister = (userParams: RegisterUserParams) =>
  usingPost("/api/v1/auth/email/register", userParams);
export const resendConfirmation = (
  confirmationParams: confirmationParamsProps
) => usingPost("/api/v1/auth/email/resendConfirmation", confirmationParams);
export const authConfirm = (codeParams: ConfirmParams) =>
  usingPost("/api/v1/auth/email/confirm", codeParams);
export const getHabitsCategory = () =>
  usingGet("/api/v1/category?limit=10&page=1");
export const getAllLanguages = () =>
  usingGet("/api/v1/auth/languageOptions?limit=30&page=1");
export const addUserHabits = (userParams: any) =>
  usingPatch("/api/v1/auth/me", userParams);
export const setUserProfile = (userParams: any) =>
  usingPatch("/api/v1/auth/me", userParams);

export const setUserAvatar = (userParams: any) =>
  usingPatch("/api/v1/auth/me", userParams);

export const uploadUserAvatar = (userParams: any) =>
  usingPost("/api/v1/media/upload", userParams);
export const authMe = () => usingGet("/api/v1/auth/me");
export const authEdit = (newUserData: EditUserParams) =>
  usingPut("/user/me", newUserData);
export const authRecover = (email: string) =>
  usingPost("/api/v1/auth/forgot/password", email);
export const authPasswordRecover = (recoverData: RecoverData) =>
  usingPost("/user/reset_password/", recoverData);
export const resetUserPassword = (recoverData: any) =>
  usingPost("/api/v1/auth/reset/password", recoverData);
export const authVerifyEmail = (data: TokenData) =>
  usingPost("/user/verify_email/", data);
export const authUpdatePhoto = (obj: any) =>
  usingPost("/user/update_photo/", obj);
export const getSurveyOptions = () => usingGet("/api/v1/survey/options");
export const setRegistrationOptionsAbout = (data: any) =>
  usingPost("/api/v1/survey", data);
export const getAppLocalization = (lang: string) =>
  usingGet(`/api/v1/localization/web/${lang}`);

export const deleteAccount = () => usingDelete(`/api/v1/auth/me`);
