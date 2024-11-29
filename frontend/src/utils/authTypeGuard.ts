import { AuthUser, AuthUserWithToken, ResetPwdInfo, SignInData, SignUpData, TentativeUser } from "@/types/authType";
import { isObj } from "./objTypeGuard";

export function isLoginData(value: unknown):value is SignInData {
  if(!isObj(value)) return false;
  const loginData = value as Record<keyof SignInData, unknown>;
  return typeof loginData.email === "string" && typeof loginData.password === "string";
}

export function isUser(value: unknown): value is AuthUser{
  if(!isObj(value)) return false;
  const user = value as Record<keyof AuthUser, unknown>;
  return typeof user.email === "string" && 
    typeof user.id === "string" && 
    typeof user.name === "string" &&
    typeof user.email === "string";
}

export function isUserWithToken(value: unknown): value is AuthUserWithToken{
  if(!isObj(value)) return false;
  const userWithToken = value as Record<keyof AuthUserWithToken, unknown>;
  return isUser(userWithToken.user) && typeof userWithToken.accessToken === "string";
}

export function isSignInData(value: unknown): value is SignInData{
  if(!isObj(value)) return false;
  const user = value as Record<keyof SignInData, unknown>;
  return typeof user.email === "string" &&
    typeof user.password === "string";; 
}

export function isSignUpData(value: unknown): value is SignUpData{
  if(!isObj(value)) return false;
  const user = value as Record<keyof SignUpData, unknown>;
  return isSignInData(user) && typeof user.name === "string"
}

export function isTentativeUserInfo(value: unknown): value is TentativeUser{
  if(!isObj(value)) return false;
  const tmpUser = value as Record<keyof TentativeUser, unknown>;
  return typeof tmpUser.name === "string" && typeof tmpUser.email === "string"
}

export function isResetPwdInfo(value: unknown): value is ResetPwdInfo{
  if(!isObj(value)) return false;
  const info = value as Record<keyof ResetPwdInfo, unknown>;
  return typeof info.token === "string" &&
    typeof info.email === "string" &&
    typeof info.id === "string";
}