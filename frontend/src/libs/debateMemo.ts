"use server"

import { auth } from "@/config/auth";
import { FetchWithAuth } from "@/utils/fetchClass";

export async function deleteMemo(serverMemoId: string){
  const uri = `${process.env.SERVER_URI}/memo/${serverMemoId}`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
  }

  try{
    await new FetchWithAuth(init).deleteMethod();
  
  }catch(error){
    throw error;
  }
}