import { AuthUser } from "@/types/authType";
import { isObj } from "./objTypeGuard";


export function isUser(value: unknown): value is AuthUser{
  if(!isObj(value)) return false;
  const user = value as Record<keyof AuthUser, unknown>;
  return typeof user.email === "string" && 
    typeof user.id === "string" && 
    typeof user.email === "string";
}