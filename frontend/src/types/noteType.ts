import { AuthUser } from "./authType";

export type Note = {
  noteId: string;
  user: AuthUser;
  title: string;
  table: string;
  script: string;
  updatedAt: string;
  createdAt: string;
}

export type PostNote = Pick<Note, "user" | "title" | "table"> 
  & Partial<Pick<Note, "script">>;

export type UpdateNote = Pick<Note, "noteId"> &
  Partial<Omit<Note, "user" | "updatedAt" | "createdAt">>;