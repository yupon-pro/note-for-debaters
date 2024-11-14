import { Note } from "@/types/noteType";

export type NoteData = Partial<Pick<Note, "noteId">> & Pick<Note, "title" | "script" | "table">;