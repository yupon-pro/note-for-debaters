import { auth } from "@/config/auth";
import Note from "@/features/english/parliament/components/Note";
import { getNoteById } from "@/features/english/parliament/libs/clientNote";
import { notFound } from "next/navigation";

// this component must be sever component because it call function to fetch resources to server.

export default async function Parliamentary({
  params
}: {
  params?: {
    id: string
  }
}){
  const id = Number(params?.id || null);

  const session = await auth();

  if(!session?.user) notFound();
  if(isNaN(id)) notFound();

  const note = await getNoteById(id);

  const defaultNote = {
    noteId: note.noteId,
    title: note.title,
    script: note.script,
    table: note.table,
  };

  const defaultMemo = note.memos?.map((memo) => ({
    ...memo,
    x: Number(memo.x),
    y: Number(memo.y),
    width: Number(memo.width),
    height: Number(memo.height),
  }));

  
  
  return (
    <Note defaultNoteData={defaultNote} defaultMemoData={defaultMemo} />
  );
}