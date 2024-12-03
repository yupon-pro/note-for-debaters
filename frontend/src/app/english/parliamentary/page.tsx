import { auth } from "@/config/auth";
import Note from "@/features/english/parliament/components/Note";
import { getNoteByLatest } from "@/features/english/parliament/libs/clientNote";

// this component must be sever component because it call function to fetch resources to server.

export default async function Parliamentary(){
  let defaultNote;
  let defaultMemo;

  const session = await auth();

  if(session?.user){
    const note = await getNoteByLatest();

    if(!note) return;
  
    defaultNote = {
      noteId: note.noteId,
      title: note.title,
      script: note.script,
      table: note.table,
    };

    defaultMemo = note.memos?.map((memo) => ({
      ...memo,
      x: Number(memo.x),
      y: Number(memo.y),
      width: Number(memo.width),
      height: Number(memo.height),
    }));

  }
  
  return (
    <Note defaultNoteData={defaultNote} defaultMemoData={defaultMemo} />
  );
}