import { AuthUser } from "./authType";

type BasePostData = {
  clientPostingId: string;
  serverPostingId?: string;
  noteId?: string;
  content: string;
}

export type ClientPostData = BasePostData & {
  width: number;
  height: number;
  x: number;
  y: number;
}

export type ServerPostData = BasePostData & {
  width: string;
  height: string;
  x: string;
  y: string;
  user: AuthUser;
  updatedAt: string;
  createdAt: string;
};

export type PostPosting = Omit<ServerPostData, "serverPostingId" | "updatedAt" | "createdAt">;

export type UpdatePosting = Pick<ServerPostData, "serverPostingId"> & Partial<ServerPostData>;