export type SignInData = {
  email: string;
  password: string;
}

export type SignUpData = SignInData & {
  name: string;
}

export type TentativeUser = Omit<SignUpData, "password">

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthUserWithToken = {
  user: AuthUser;
  accessToken: string;
}

export type ResetPwdInfo = {
  token: string;
  id: string;
  email: string;
}