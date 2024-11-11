"use server"

import { auth } from "@/config/auth";
import { PostNote, UpdateNote } from "@/types/noteType";
import { FetchWithAuth } from "@/utils/fetchClass";
import { isNote, isNotes } from "@/utils/noteTypeGuard";

export async function getNote(id: string){
  const uri = `${process.env.SERVER_URI}/note/${id}`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
    tag: ["note"]
  }

  try{
    const note = await new FetchWithAuth(init).getMethod();
    if(!isNote(note)) throw new Error("Note Type Error");

    return note;

  }catch(error){
    throw error;
  }
}

export async function getNotes(){
  const uri = `${process.env.SERVER_URI}/note`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    accessToken,
    tag: ["note"],
  }

  try{
    const notes = await new FetchWithAuth(init).getMethod();
    if(!isNotes(notes)) throw new Error("Note Type Error");

    return notes;

  }catch(error){
    throw error;
  }
}

export async function postNote(note: PostNote ){
  const uri = `${process.env.SERVER_URI}/note`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    body: note,
    accessToken,
    tag: ["note"],
  }

  try{
    const note = await new FetchWithAuth(init).postMethod();
    if(!isNote(note)) throw new Error("Note Type Error");

    return note;

  }catch(error){
    throw error;
  }
}

export async function updateNote(note: UpdateNote ){
  const uri = `${process.env.SERVER_URI}/note/${note.noteId}`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

  const init = {
    uri,
    body: note,
    accessToken
  }

  try{
    const note = await new FetchWithAuth(init).updateMethod();
    if(!isNote(note)) throw new Error("Note Type Error");

    return note;

  }catch(error){
    throw error;
  }
}

export async function deleteNote(noteId: string ){
  const uri = `${process.env.SERVER_URI}/note/${noteId}`;
  const accessToken = (await auth())?.accessToken;
  if(!accessToken) throw new Error("Failed to GEt Access Token");

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
