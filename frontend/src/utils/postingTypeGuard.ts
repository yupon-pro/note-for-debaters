import { Posting } from "@/types/postingType";
import { isObj } from "./objTypeGuard";
import { isUser } from "./authTypeGuard";

function isPosting(value: unknown): value is Posting{
  if(!isObj(value)) return false;

  const posting = value as Record<keyof Posting, unknown>;
  if(!isUser(posting.user)) return false;

  return typeof posting.x === "string" &&
    typeof posting.y === "string" &&
    typeof posting.width === "string" &&
    typeof posting.height === "string" &&
    typeof posting.content === "string" &&
    typeof posting.noteId === "string" &&
    typeof posting.postingId === "string";
}

export function isPostings(value: unknown): value is Posting[]{
  if(!isObj(value)) return false;

  if(!Array.isArray(value)) return false;

  const postings = value as Record<keyof Posting, unknown>[];

  return postings.every((posting) => isPosting(posting));
}