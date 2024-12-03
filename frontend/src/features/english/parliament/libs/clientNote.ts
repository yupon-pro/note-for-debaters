import {  getLatestNote, getNote,  postNote, updateNote } from "@/libs/debateNote";
import { PostNote, UpdateNote } from "@/types/noteType";

export async function getNoteByLatest() {
  return await getLatestNote();
}

export async function getNoteById(id: number) {
  return await getNote(id);
}

export async function saveNote(note: PostNote){
  await postNote(note);

};

export async function editNote(note: UpdateNote){
  await updateNote(note);
}
