import { AuthUser, SignInData, SingUpData } from "@/types/authType";
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

export function isSignInData(value: unknown): value is SignInData{
  if(!isObj(value)) return false;
  const user = value as Record<keyof SignInData, unknown>;
  return typeof user.email === "string" &&
    typeof user.password === "string";; 
}

export function isSignUpData(value: unknown): value is SingUpData{
  if(!isObj(value)) return false;
  const user = value as Record<keyof SingUpData, unknown>;
  return isSignInData(user) && typeof user.name === "string"
}
