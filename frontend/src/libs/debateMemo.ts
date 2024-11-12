"use server"

import { auth } from "@/config/auth";
import {  PostMemo, UpdateMemo } from "@/types/memoType";
import { FetchWithAuth } from "@/utils/fetchClass";
import { isMemos } from "@/utils/memoTypeGuard";

export async function getMemos(NoteId: string){
  const uri = `${process.env.SERVER_URI}/memo`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
    body: { NoteId },
    tag: ["memo"]
  }

  try{
    const memos = await new FetchWithAuth(init).getMethod();
    if(!isMemos(memos)) throw new Error("Note Type Error");

    return memos;

  }catch(error){
    throw error;
  }
}

export async function postMemo(memo: PostMemo){
  const uri = `${process.env.SERVER_URI}/memo/`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
    body: memo,
    tag: ["memo"],
  }

  try{
    const memos = await new FetchWithAuth(init).postMethod();
    if(!isMemos(memos)) throw new Error("Note Type Error");

    return memos;

  }catch(error){
    throw error;
  }
}

export async function updateMemo(memo: UpdateMemo){
  const uri = `${process.env.SERVER_URI}/memo/${memo.serverMemoId}`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
    body: memo,
    tag: ["memo"],
  }

  try{
    const Memos = await new FetchWithAuth(init).updateMethod();
    if(!isMemos(Memos)) throw new Error("Note Type Error");

    return Memos;

  }catch(error){
    throw error;
  }
}


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