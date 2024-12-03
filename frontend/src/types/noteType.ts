import { AuthUser } from "./authType";
import { PostMemo, ServerMemoData, UpdateMemo} from "./memoType";

export type Note = {
  noteId: string;
  userId: string;
  user: AuthUser;
  title: string;
  table: string;
  script: string;
  memos: ServerMemoData[]
  updatedAt: string;
  createdAt: string;
}

export type PostNote = { memos: PostMemo[] }
  & Pick<Note, "userId" | "title" | "table" > 
  & Partial<Pick<Note, "title" | "script">>;

export type UpdateNote = { memos: UpdateMemo[] }
  & Pick<Note, "noteId"> 
  & Partial<Pick<Note, "title" | "table" | "script">>;