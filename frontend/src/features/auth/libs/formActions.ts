"use server";

import { signIn } from "@/config/auth";
import { MailCodeState, MailInputState, ResetPwdState, SignInState, SignUpState } from "../types/formTypes";
import { AuthError } from "next-auth";
import { EmailScheme, ResetPwdScheme, SignInScheme, SignUpScheme } from "../schemes/formSchemes";
import {  authenticateMailCode, authenticateUser, deleteTentativeUser, postResetToken, postTentativeUser, postUser,  resetPasswordDirectly, } from "@/libs/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendGmail } from "@/utils/mailer";
import crypto from "crypto";
import { z } from "zod";

export async function signInFormAction(prevState: SignInState, formData: FormData): Promise<SignInState>{
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
  revalidatePath("/mypage");
  redirect("/mypage"); 
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
  const text = `${name}さん、こんにちは！認証コードは${mailCode}です！お早めに登録を完了させてください。`

  try{
    await postTentativeUser(signUpData, mailCode);
    await sendGmail(email, text);
    
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

export async function verifyMailCodeFormAction(prevState: MailCodeState, formData: FormData): Promise<MailCodeState> {
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
    // [Notion]
    // This function contains four methods to communicate with api server.
    // 1. verify the email auth code (gain the user info)
    // 2. delete the tentative user.
    // 3. register the user info to the stable user table in back end.
    const Verification = await authenticateMailCode(mailCode);

    if(Verification.data && Verification.status === "Success"){
      await deleteTentativeUser(mailCode);
      await postUser(Verification.data);
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

export async function verifyEmailFormAction(prevState: MailInputState, formData: FormData): Promise<MailInputState> {
  const safeFields = EmailScheme.safeParse({
    email: formData.get("email"),
  });

  if(!safeFields.success){
    const errors = {
      errors: safeFields.error.flatten().fieldErrors,
      message: "Missing Fields"
    };
    return errors;
  }

  const { email } = safeFields.data;

  const token = crypto.randomBytes(32).toString('hex');
  const text = `
    This is URL link for change of password. 
    If it will pass more than 15 minutes, the link will expires. Please Be Cautious.
    ${process.env.CLIENT_URI}/auth/reset/${token}
    `
  
  try{
    const userId = await authenticateUser(email);
    await sendGmail(email, text);
    await postResetToken(token, userId, email);
    
  }catch(error){
    return { message: `Verify Email Error: ${error instanceof Error ? error.message : "Something wrong"}` };
  }

  return {};
}

export async function resetPasswordFormAction(
  userId: string,
  prevState: ResetPwdState, 
  formData: FormData, 
): Promise<ResetPwdState> {

  const safeFields = ResetPwdScheme.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if(!safeFields.success){
    const errors = {
      errors: safeFields.error.flatten().fieldErrors,
      message: "Missing Fields"
    };
    return errors;
  }

  const { password } = safeFields.data;

  try{
    const signInData = await resetPasswordDirectly(userId, password);
    await signIn("credentials", { 
      email: signInData.email, 
      password: signInData.password,
    });

  }catch(error){
    return { message: `SignUpError: ${error instanceof Error ? error.message : "Something wrong"}` }
  }
  
  revalidatePath("/mypage")
  redirect("/mypage");
}