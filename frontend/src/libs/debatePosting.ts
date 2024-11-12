"use server"

import { auth } from "@/config/auth";
import { PostPosting, UpdatePosting } from "@/types/postingType";
import { FetchWithAuth } from "@/utils/fetchClass";
import { isPostings } from "@/utils/postingTypeGuard";

export async function getPostings(NoteId: string){
  const uri = `${process.env.SERVER_URI}/posting`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
    body: { NoteId },
    tag: ["posting"]
  }

  try{
    const postings = await new FetchWithAuth(init).getMethod();
    if(!isPostings(postings)) throw new Error("Note Type Error");

    return postings;

  }catch(error){
    throw error;
  }
}

export async function postPosting(posting: PostPosting){
  const uri = `${process.env.SERVER_URI}/posting/`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
    body: posting,
    tag: ["posting"],
  }

  try{
    const postings = await new FetchWithAuth(init).postMethod();
    if(!isPostings(postings)) throw new Error("Note Type Error");

    return postings;

  }catch(error){
    throw error;
  }
}

export async function updatePosting(posting: UpdatePosting){
  const uri = `${process.env.SERVER_URI}/posting/${posting.postingId}`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
    body: posting,
    tag: ["posting"],
  }

  try{
    const postings = await new FetchWithAuth(init).updateMethod();
    if(!isPostings(postings)) throw new Error("Note Type Error");

    return postings;

  }catch(error){
    throw error;
  }
}


export async function deletePosting(postingId: string){
  const uri = `${process.env.SERVER_URI}/posting/${postingId}`;
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