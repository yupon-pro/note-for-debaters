import { auth } from "@/config/auth";
import Note from "@/features/english/parliament/components/Note";
import { getNoteWithCommand } from "@/features/english/parliament/libs/clientNote";
import { getMemosInNote, } from "@/features/english/parliament/libs/clientMemo";

// this component must be sever component because it call function to fetch resources to server.

export default async function Parliamentary({
    params
  }: {
    params?: {
      id: string
    }
  }){
  let defaultNote;
  let defaultMemo;

  const session = await auth();

  if(session?.user){
    const id = params?.id ? Number(params.id) : null;
    const note = (id && !Number.isNaN(id)) ? await getNoteWithCommand("single", id) : await getNoteWithCommand("latest")

    if(note && !Array.isArray(note)){ 
      defaultNote = {
        noteId: note.noteId,
        title: note.title,
        script: note.script,
        table: note.table,
      };

      const memos = await getMemosInNote(note.noteId);

      defaultMemo = memos;
    }
  }  
  
  return (
    <Note defaultNoteData={defaultNote} defaultMemoData={defaultMemo} />
  );
}