"use server";

import { signIn } from "@/config/auth";
import { SignInState, SignUpState } from "../types/formTypes";
import { AuthError } from "next-auth";
import { SignInScheme, SignUpScheme } from "../schemes/formSchemes";
import { postUser } from "@/libs/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signInAction(prevState: SignInState, formData: FormData): Promise<SignInState>{
  const safeFields = SignInScheme.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if(!safeFields.success){
    const errors = {
      errors: safeFields.error.flatten().fieldErrors,
      message: "Missing Fields"
    };
    return errors;
  }

  const { email, password } = safeFields.data;

  try{
    await signIn("credentials", { email, password });
  }catch(error){
    const errors = {
      message: 
        error instanceof AuthError
        ? error.type === "CredentialsSignin"
          ? "invalid Credentials"
          : "Something went wrong."
        : "An unknown error occurred"
    };
    return errors;
  }
  revalidatePath("/english/parliamentary");
  redirect("/english/parliamentary"); 
}

export async function signUpAction(prevState: SignUpState, formData: FormData):Promise<SignUpState>{
  const safeFields = SignUpScheme.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if(!safeFields.success){
    const errors = {
      status: "Failure",
      errors: safeFields.error.flatten().fieldErrors,
      message: "Missing Fields"
    } as const;
    return errors;
  }

  const { username, email, password } = safeFields.data;

  try{
    await postUser({ name: username, email, password });
    await signIn("credentials", {email, password });
    
  }catch(error){
    const errors = {
      status: "Failure",
      message: `SignUpError: ${error instanceof Error ? error.message : "Something wrong"}`
    } as const;
    return errors
  }
  const result = {
    status: "Success",
  } as const;
  return result;
}