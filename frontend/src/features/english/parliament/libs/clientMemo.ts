import { deleteMemo, getMemos, postMemo, updateMemo } from "@/libs/debateMemo";
import {  PostMemo, UpdateMemo } from "@/types/memoType";


export async function getMemosInNote(NoteId: string){
  const memos = await getMemos(NoteId);

  const memoData = memos.map((memo) => {
    const memoProps = {
      content: memo.content,
      width: Number(memo.width),
      height: Number(memo.height),
      x: Number(memo.x),
      y: Number(memo.y),
    };
    return {...memo, ...memoProps};
  });

  return memoData
}

export async function saveMemos(memos: PostMemo[]) {
  for(const memo of memos) {
    await postMemo(memo);
  }
}

export async function editMemos(memos: UpdateMemo[]) {
  for(const memo of memos) {
    await updateMemo(memo);
  }
}

export async function removeMemo(serverMemoId: string) {
  await deleteMemo(serverMemoId);
}