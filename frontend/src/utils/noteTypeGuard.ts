import { Note } from "@/types/noteType";
import { isObj } from "./objTypeGuard";
import { isUser } from "./authTypeGuard";

export function isNote(value: unknown): value is Note{
  if(!isObj(value)) return false;

  const note = value as Record<keyof Note, unknown>;
  if(!isUser(note.user)) return false;

  return typeof note.noteId === "string" && 
    typeof note.title === "string" &&
    typeof note.content === "string" &&
    typeof note.createdAt === "string" &&
    typeof note.updatedAt === "string";
}


export function isNotes(value: unknown): value is Note[]{
  if(!isObj(value)) return false;
  if(!Array.isArray(value)) return false;

  const notes = value as Record<keyof Note, unknown>[];

  return notes.every((note) => isNote(note));
}