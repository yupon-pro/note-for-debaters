"use server";

import { AuthUser, SignInData } from "@/types/authType";
import { isUser } from "@/utils/authTypeGuard";

export async function getUser(signInData: SignInData):Promise<AuthUser>{
  const uri = process.env.SERVER_URI;

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

