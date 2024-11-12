import { Note } from "@/types/noteType";

export type NoteData = Partial<Pick<Note, "noteId" | "title">> & Pick<Note, "content">;