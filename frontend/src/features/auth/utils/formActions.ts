"use server";

import { signIn } from "@/config/auth";
import { MailCode, SignInState, SignUpState } from "../types/formTypes";
import { AuthError } from "next-auth";
import { SignInScheme, SignUpScheme } from "../schemes/formSchemes";
import {  authenticateMailCode, deleteTentativeUser, registerTentativeUser, registerUser, } from "@/libs/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendGmail } from "@/utils/mailer";
import { z } from "zod";

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

export async function signUpFormAction(prevState: SignUpState, formData: FormData):Promise<SignUpState>{
  const safeFields = SignUpScheme.safeParse({
    name: formData.get("name"),
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

  const { name, email, password } = safeFields.data;
  const signUpData = { name, email, password };
  const mailCode = crypto.randomUUID();

  try{
    await registerTentativeUser(signUpData, mailCode);
    await sendGmail(email, mailCode, name);
    
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

export async function verifyMailCodeAction(prevState: MailCode, formData: FormData): Promise<MailCode> {
  const safeField = z.object({ code: z.string() }).safeParse({ code: formData.get("code") });

  if(!safeField.success) {
    const errors = {
      status: "Failure",
      errors: safeField.error.flatten().fieldErrors,
      message: "Missing Fields"
    } as const;
    return errors; 
  }

  const { code: mailCode } = safeField.data;

  try{
    const Verification = await authenticateMailCode(mailCode);

    if(Verification.data && Verification.status === "Success"){
      await deleteTentativeUser(mailCode);
      await registerUser(Verification.data);
      await signIn("credentials", { 
        email: Verification.data.email, 
        password: Verification.data.password 
      });

      const result = {
        status: "Success",
      } as const;

      return result;

    }else{
      const errors = {
        status: "Failure",
        message:
          Verification.status === "Invalid"
            ? "Your code is invalid"
            : Verification.status === "Timeout"
            ? "Your session has expired. Please start over again."
            : "Something went wrong. Please start over again."
      } as const;
      return errors;
    }

  }catch(error){
    const errors = {
      status: "Failure",
      message: `MailCodeError: ${error instanceof Error ? error.message : "Something wrong"}`
    } as const;
    return errors
  }
}