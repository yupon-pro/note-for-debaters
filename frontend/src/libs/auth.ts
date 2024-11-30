"use server";

import { auth, signOut } from "@/config/auth";
import { AuthUser, AuthUserWithToken, SignInData,} from "@/types/authType";
import { isResetPwdInfo, isSignInData, isTentativeUserInfo, isUser, isUserWithToken } from "@/utils/authTypeGuard";
import { FetchWithAuth } from "@/utils/fetchClass";

// sign in.
export async function authenticate(signInData: SignInData): Promise<AuthUserWithToken>{
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

    const userWithToken = await res.json();
    if(!isUserWithToken(userWithToken)) throw new Error("Type of User with token is Error");

    return userWithToken;
  }catch(error){
    throw error;
  }
}

// sign out
export async function signOutAction(){
  await signOut();
}

// sign up actions
export async function registerTentativeUser(signUpData: SignInData, mailCode: string){
  // [Notion]
  // This function assume that the password won't be encrypted in server api.
  // The password is supposed to be encrypted when the sign up process successes.
  const uri = `${process.env.SERVER_URI}/sign_up/tentative_user`;

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

    const tmpUserInfo = await res.json();
    if(!isTentativeUserInfo(tmpUserInfo)) throw new Error("SignUp Data Type Error");
    return tmpUserInfo;

  }catch(error){
    throw error;
  }
}

export async function registerUser(mailCode: string): Promise<AuthUserWithToken> {
  // [Notion]
  // This function contains four methods to communicate with api server.
  // 1. verify the email auth code
  // 2. delete the tentative user.
  // 3. register the user info to the stable user table in back end.
  const uri = `${process.env.SERVER_URI}/sign_up/user`;

  try{
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mailCode })
    });

    if(res.status !== 201){
      throw new Error("Fetch Error");
    }
    
    const userWithToken = await res.json();
    if(!isUserWithToken(userWithToken)) throw new Error("Type of User with token is Error");

    return userWithToken;
  }catch(error){
    console.log(error);
    throw error
  }
}

// reset pwd actions.
export async function authenticateUser(email: string){
  // [Notion]
  // Because the reset pwd actions are used when the user doesn't sign in, 
  // it is necessary to access to the resource to gain user id.
  const uri = `${process.env.SERVER_URI}/user/${email}`;

  try{
    const res = await fetch(uri);

    if(res.status !== 200) {
      throw new Error("Fail to authenticate user");
    }
    
    const user = await res.json();
    if(!isUser(user)) throw new Error("Type of user is wrong.");
    return user;

  }catch(error){
    throw error;
  }
}

export async function registerResetToken(token: string, id: string, email: string) {
  const uri = `${process.env.SERVER_URI}/reset_pwd/`;

  try{
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, email, id }),
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

    const resetPwdInfo = await res.json();
    if(!isResetPwdInfo(resetPwdInfo)) throw new Error("Type of user id is wrong.");
    return resetPwdInfo.id;

  }catch(error){
    console.log(error);
    return null;
  }
}

export async function resetPasswordDirectly(id: string, password: string): Promise<SignInData> {
  const uri = `${process.env.SERVER_URI}/user`;

  try{
    const res = await fetch(uri, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password, id }),
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

export async function deleteResetToken(token: string){
  const uri = `${process.env.SERVER_URI}/reset_pwd/${token}`;

  try{
    const res = await fetch(uri, { method: "DELETE" });

    if(res.status !== 204) {
      throw new Error("Fail to delete token.");
    }

    const resetPwdInfo = await res.json();
    if(!isResetPwdInfo(resetPwdInfo)) throw new Error("Type of user id is wrong.");
    return resetPwdInfo.id;

  }catch(error){
    console.log(error);
    return null;
  }
}

// Actions needed to be authorized
export async function patchUser(name?: string, password?: string): Promise<AuthUser> {
  const uri = `${process.env.SERVER_URI}/user/auth/`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to Get Access Token");

  const body: {[key: string]: string} | undefined = (name && password) ? {name, password} 
    : name ? { name } 
    : password ? { password } 
    : undefined

  const init = {
    uri,
    accessToken,
    body
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