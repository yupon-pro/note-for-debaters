"use server";

import { auth } from "@/config/auth";
import { AuthUser, SignInData, SingUpData } from "@/types/authType";
import { isSignInData, isSignUpData, isUser } from "@/utils/authTypeGuard";
import { FetchWithAuth } from "@/utils/fetchClass";

// sign in.
export async function authenticate(signInData: SignInData):Promise<AuthUser>{
  // [Notion]
  // This function is special.
  // Other functions in this script will be called nearer client script (form actions).
  // However, this function will be called in auth.js initializing function
  const uri = `${process.env.SERVER_URI}/user/signin`;

  try{
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signInData),
      cache: "no-store",
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

// sign up actions
export async function registerTentativeUser(signUpData: SingUpData, mailCode: string){
  // This function assume that the password won't be encrypted in server api.
  // The password is supposed to be encrypted when the sign up process successes.
  const uri = `${process.env.SERVER_URI}/tentative_user`;

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
  const uri = `${process.env.SERVER_URI}/tentative_user/${mailCode}`;

  try{
    const res = await fetch(uri);

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

export async function removeTentativeUser(mailCode: string) {
  const uri = `${process.env.SERVER_URI}/tentative_user/${mailCode}`;

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
  const uri = `${process.env.SERVER_URI}/user/signup`;

  try{
    const res = await fetch(uri, {
      method: "POST",
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

// reset pwd actions.
export async function authenticateUser(email: string){
  const uri = `${process.env.SERVER_URI}/user/?email=${email}`;

  try{
    const res = await fetch(uri);

    if(res.status !== 200) {
      throw new Error("Fail to authenticate user");
    }
    
    const userId = await res.json();
    if(typeof userId !== "string") throw new Error("Type of user id is wrong.");
    return userId;

  }catch(error){
    throw error;
  }
}

export async function registerResetToken(token: string, userId: string, email: string) {
  const uri = `${process.env.SERVER_URI}/reset_pwd/`;

  try{
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, userId, email }),
    });

    if(res.status !== 201) {
      throw new Error("Fail to post token");
    }

    await res.json();

  }catch(error){
    throw error;
  }
}

export async function authenticateToken(token: string){
  const uri = `${process.env.SERVER_URI}/reset_pwd/${token}`;

  try{
    const res = await fetch(uri);

    if(res.status !== 200) {
      throw new Error("Fail to authenticate token.");
    }

    const userId = await res.json();
    if(typeof userId !== "string") throw new Error("Type of user id is wrong.");
    return userId;

  }catch(error){
    console.log(error);
    return null;
  }
}

export async function resetPasswordDirectly(userId: string, password: string): Promise<SignInData> {
  const uri = `${process.env.SERVER_URI}/user`;

  try{
    const res = await fetch(uri, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, password }),
    });

    if(res.status !== 200) {
      throw new Error("Fail to reset password.");
    }

    const signInData = await res.json();
    if(!isSignInData(signInData)) throw new Error("Type of sign in data is wrong.");
    return signInData;

  }catch(error){
    throw error;
  }
}

// Actions needed to be authorized
export async function patchUser(name: string, password: string): Promise<AuthUser> {
  const uri = `${process.env.SERVER_URI}/user/auth/`;

  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to Get Access Token");

  const init = {
    uri,
    accessToken,
    body: { name, password }
  }

  try{
    const newUser = await new FetchWithAuth(init).updateMethod();
    if(!isUser(newUser)) throw new Error("Type of user is wrong.")
    return newUser

  }catch(error){
    throw error;
  }
}

export async function deleteUser() {
  const uri = `${process.env.SERVER_URI}/user/auth/`;

  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to Get Access Token");

  const init = {
    uri,
    accessToken
  }

  try{
    await new FetchWithAuth(init).deleteMethod();

  }catch(error){
    throw error;
  }
}