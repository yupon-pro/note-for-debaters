import { deletePosting, getPostings, postPosting, updatePosting } from "@/libs/debatePosting";
import { PostPosting, UpdatePosting } from "@/types/postingType";

export async function getPostingsInNote(NoteId: string){
  const postings = await getPostings(NoteId);

  const postData = postings.map((posting) => {
    const postingProps = {
      content: posting.content,
      width: Number(posting.width),
      height: Number(posting.height),
      x: Number(posting.x),
      y: Number(posting.y),
    };
    return {...posting, postingProps}
  });

  return postData
}

export async function savePostings(postings: PostPosting[]) {
  for(const posting of postings) {
    await postPosting(posting);
  }
}

export async function editPostings(postings: UpdatePosting[]) {
  for(const posting of postings) {
    await updatePosting(posting);
  }
}

export async function removePosting(postingId: string) {
  await deletePosting(postingId);
}