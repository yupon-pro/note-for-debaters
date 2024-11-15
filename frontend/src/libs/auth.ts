"use server";

import { AuthUser, SignInData, SingUpData } from "@/types/authType";
import { isUser } from "@/utils/authTypeGuard";

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

export async function postUser(signUpData: SingUpData){
  // This function only aims to create user.
  // Subsequently, signIn will be called where this function is called.
  const uri = `${process.env.SERVER_URI}/auth/register`;

  if(!uri) throw new Error("URI Error");

  try{
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signUpData)
    });

    if(res.status !== 201){
      throw new Error("Fetch Error");
    }

  }catch(error){
    throw error;
  }
}

