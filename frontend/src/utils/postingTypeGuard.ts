import { ServerPostData } from "@/types/postingType";
import { isObj } from "./objTypeGuard";
import { isUser } from "./authTypeGuard";

function isPosting(value: unknown): value is ServerPostData{
  if(!isObj(value)) return false;

  const posting = value as Record<keyof ServerPostData, unknown>;
  if(!isUser(posting.user)) return false;

  return typeof posting.x === "string" &&
    typeof posting.y === "string" &&
    typeof posting.width === "string" &&
    typeof posting.height === "string" &&
    typeof posting.content === "string" &&
    typeof posting.noteId === "string" &&
    typeof posting.clientPostingId === "string" &&
    typeof posting.serverPostingId === "string" &&
    typeof posting.createdAt === "string" &&
    typeof posting.updatedAt === "string";
}

export function isPostings(value: unknown): value is ServerPostData[]{
  if(!isObj(value)) return false;

  if(!Array.isArray(value)) return false;

  const postings = value as Record<keyof ServerPostData, unknown>[];

  return postings.every((posting) => isPosting(posting));
}