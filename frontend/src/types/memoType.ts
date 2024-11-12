import { AuthUser } from "./authType";

type BaseMemoData = {
  clientMemoId: string;
  serverMemoId?: string;
  noteId?: string;
  content: string;
}

export type ClientMemoData = BaseMemoData & {
  width: number;
  height: number;
  x: number;
  y: number;
}

export type ServerMemoData = BaseMemoData & {
  width: string;
  height: string;
  x: string;
  y: string;
  user: AuthUser;
  updatedAt: string;
  createdAt: string;
};

export type PostMemo = Omit<ServerMemoData, "serverMemoId" | "updatedAt" | "createdAt">;

export type UpdateMemo = Pick<ServerMemoData, "serverMemoId"> & Partial<ServerMemoData>;