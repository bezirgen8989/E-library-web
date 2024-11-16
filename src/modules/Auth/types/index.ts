export type LoginUserParams = {
  email: string,
  password: string
}

export type GoogleLoginUserParams = {
  idToken: string,
}
export type ConfirmParams = {
  codeOrHash: string,
}
export type RegisterUserParams = {
  photo_url?: string
  name: string,
  password: string,
  confirm?: string,
  position?: string,
  location?: string,
  email: string,
  phone?: string
}
export type EditUserParams = {
  name: string,
  email: string,
  old_password?: string,
  password?: string,
  photo_url?: string
}

export type RecoverData = {
  token: string
  new_password: string,
}

export type TokenData = {
  token: string
}