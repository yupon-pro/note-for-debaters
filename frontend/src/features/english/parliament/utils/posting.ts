import { getPostings } from "@/libs/debatePosting";
import { PostData } from "../types/posts";

export async function getPostingsInNote(NoteId: string){
  const postings = await getPostings(NoteId);

  const postData = Object.fromEntries(postings.map((posting) => {
    const postingProps = {
      content: posting.content,
      width: Number(posting.width),
      height: Number(posting.height),
      x: Number(posting.x),
      y: Number(posting.y),
    };
    return [posting.postingId, postingProps]
  }));

  return postData
}

