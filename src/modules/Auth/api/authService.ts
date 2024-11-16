import {usingGet, usingPatch, usingPost, usingPut} from 'api/apiHelpers'
import {
    ConfirmParams,
    EditUserParams, GoogleLoginUserParams,
    LoginUserParams,
    RecoverData,
    RegisterUserParams,
    TokenData
} from 'modules/Auth/types'

export const authLogin = (formParams: LoginUserParams) => usingPost('/api/v1/auth/email/login', formParams)
export const authGoogleLogin = (formParams: GoogleLoginUserParams) => usingPost('/api/v1/auth/google/login', formParams)
export const authRegister = (userParams: RegisterUserParams) => usingPost('/api/v1/auth/email/register', userParams)
export const authConfirm = (codeParams: ConfirmParams) => usingPost('/api/v1/auth/email/confirm', codeParams)
export const getHabitsCategory = () => usingGet('/api/v1/category?limit=10&page=1')
export const getAllLanguages = () => usingGet('/api/v1/auth/languageOptions?limit=10&page=1')
export const addUserHabits = (userParams: any) => usingPatch('/api/v1/auth/me', userParams)
export const setUserProfile = (userParams: any) => usingPatch('/api/v1/auth/me', userParams)
export const uploadUserAvatar = (userParams: any) => usingPost('/api/v1/media/upload', userParams)
export const authMe = () => usingGet('/api/v1/auth/me')
export const authEdit = (newUserData: EditUserParams) => usingPut('/user/me', newUserData)
export const authRecover = (email: string) => usingPost('/api/v1/auth/forgot/password', email)
export const authPasswordRecover = (recoverData: RecoverData) => usingPost('/user/reset_password/', recoverData)
export const resetUserPassword = (recoverData: any) => usingPost('/api/v1/auth/reset/password', recoverData)
export const authVerifyEmail = (data: TokenData) => usingPost('/user/verify_email/', data)
export const authUpdatePhoto = (obj: any) => usingPost('/user/update_photo/', obj)






