"use server";

import { AuthUser, SignInData, SingUpData } from "@/types/authType";
import { isSignInData, isSignUpData, isUser } from "@/utils/authTypeGuard";

export async function authenticate(signInData: SignInData):Promise<AuthUser>{
  // This function is special.
  // Other functions in this script will be called nearer client script (form actions).
  // However, this function will be called in auth.js initializing function
  const uri = `${process.env.SERVER_URI}/auth/login`;

  if(!uri) throw new Error("URI Error");

  try{
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signInData)
    });

    if(res.status !== 200){
      throw new Error("Fetch Error");
    }

    const user = await res.json();
    if(!isUser(user)) throw new Error("Type User Error");

    return user;
  }catch(error){
    throw error;
  }
}

export async function registerTentativeUser(signUpData: SingUpData, mailCode: string){
  const uri = `${process.env.SERVER_URI}/auth/tentative_registration`;

  if(!uri) throw new Error("URI Error");

  const tentativeUser = {
    ...signUpData,
    mailCode,
  };

  try{
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tentativeUser)
    });

    if(res.status !== 201){
      throw new Error("Fetch Error");
    }

    const userTentativeInfo = await res.json()
    return userTentativeInfo
  }catch(error){
    throw error;
  }
}

type Verification = {
  status: string;
  data?: SingUpData;
}

export async function authenticateMailCode(mailCode: string): Promise<Verification> {
  const uri = `${process.env.SERVER_URI}/auth/tentative_registration/${mailCode}`;

  if(!uri) throw new Error("URI Error");

  try{
    const res = await fetch(uri, { method: "GET" });

    const status = res.statusText || "Success";
    if(status !== "Success"){
      return {status}
    }else{
      const signUpData = await res.json();
      if(!isSignUpData(signUpData)) throw new Error("SignUp Data Type Error");
      return {status, data: signUpData};
    }

  }catch(error){
    console.log(error);
    return { status: "Unknown" };
  }
}

export async function deleteTentativeUser(mailCode: string) {
  const uri = `${process.env.SERVER_URI}/auth/tentative_registration/${mailCode}`;

  if(!uri) throw new Error("URI Error");

  try{
    const res = await fetch(uri, { method: "DELETE" });

    if(res.status !== 204) {
      throw new Error("Failed to delete tentative user data");
    }

    await res.json();

  }catch(error){
    throw error;
  }
}

export async function registerUser(signUpData: SingUpData): Promise<SignInData> {
  const uri = `${process.env.SERVER_URI}/auth/registration`;

  if(!uri) throw new Error("URI Error");

  try{
    const res = await fetch(uri, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signUpData),
    });

    if(res.status !== 201) {
      throw new Error("Fail to create user");
    }

    const signInData = await res.json();
    if(!isSignInData(signInData)) throw new Error("SignIn Data Type Error");
    return signInData

  }catch(error){
    throw error;
  }
}