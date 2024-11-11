export type SignInData = {
  email: string;
  password: string;
}

export type SingUpData = SignInData & {
  name: string;
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};