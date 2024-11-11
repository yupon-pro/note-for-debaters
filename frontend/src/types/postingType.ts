import { AuthUser } from "./authType";

export type Posting = {
  postingId: string;
  noteId: string;
  user: AuthUser;
  x: string;
  y: string;
  width: string;
  height: string;
  content: string;
  updatedAt: string;
  createdAt: string;
};

export type PostPosting = Omit<Posting, "postingId" | "user" | "createdAt" | "updatedAt" >;

export type UpdatePosting = Pick<Posting, "postingId"> & Partial<Posting>;