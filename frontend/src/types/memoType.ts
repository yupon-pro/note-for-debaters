import { AuthUser } from "./authType";

type RelatedInfo = {
  serverMemoId: string;
  noteId: string;
  userId: string;
  user: AuthUser;
}

type BaseMemoData = {
  clientMemoId: string;
  content: string;
}

export type ClientMemoData = BaseMemoData & Partial<RelatedInfo> & {
  width: number;
  height: number;
  x: number;
  y: number;
}

export type ServerMemoData = BaseMemoData & RelatedInfo & {
  width: string;
  height: string;
  x: string;
  y: string;
  updatedAt: string;
  createdAt: string;
};

export type PostMemo = Omit<ClientMemoData, keyof RelatedInfo> & Pick<RelatedInfo, "userId">;

export type UpdateMemo = Omit<ClientMemoData, Exclude<keyof RelatedInfo, "serverMemoId">> & Pick<RelatedInfo, "userId" | "noteId">;
