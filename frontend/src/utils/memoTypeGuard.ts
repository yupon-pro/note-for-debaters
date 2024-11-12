import { ServerMemoData } from "@/types/memoType";
import { isObj } from "./objTypeGuard";
import { isUser } from "./authTypeGuard";

function isMemo(value: unknown): value is ServerMemoData{
  if(!isObj(value)) return false;

  const memo = value as Record<keyof ServerMemoData, unknown>;
  if(!isUser(memo.user)) return false;

  return typeof memo.x === "string" &&
    typeof memo.y === "string" &&
    typeof memo.width === "string" &&
    typeof memo.height === "string" &&
    typeof memo.content === "string" &&
    typeof memo.noteId === "string" &&
    typeof memo.clientMemoId === "string" &&
    typeof memo.serverMemoId === "string" &&
    typeof memo.createdAt === "string" &&
    typeof memo.updatedAt === "string";
}

export function isMemos(value: unknown): value is ServerMemoData[]{
  if(!isObj(value)) return false;

  if(!Array.isArray(value)) return false;

  const memos = value as Record<keyof ServerMemoData, unknown>[];

  return memos.every((memo) => isMemo(memo));
}