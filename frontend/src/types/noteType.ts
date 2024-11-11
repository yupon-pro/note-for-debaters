import { AuthUser } from "./authType";

export type Note = {
  noteId: string;
  user: AuthUser;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
}

export type PostNote = Pick<Note, "user" | "title" | "content">;

export type UpdateNote = Pick<Note, "noteId"> &
  Partial<Omit<Note, "user" | "updatedAt" | "createdAt">>;