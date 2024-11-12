import { auth } from "@/config/auth";
import Note from "@/features/english/parliament/components/Note";
import { getNoteWithCommand } from "@/features/english/parliament/utils/clientNote";
import { getMemosInNote, } from "@/features/english/parliament/utils/clientMemo";

// this component must be sever component because it call function to fetch resources to server.

export default async function Parliamentary(){
  let defaultNote;
  let defaultMemo;

  const session = await auth();

  if(session?.user){
    const latestNote = await getNoteWithCommand("latest");

    if(latestNote && !Array.isArray(latestNote)){ 
      defaultNote = {
        noteId: latestNote.noteId,
        title: latestNote.title,
        content: latestNote.content,
      };

      const memos = await getMemosInNote(latestNote.noteId);

      defaultMemo = memos;
    }
  }  
  
  return (
    <Note defaultNote={defaultNote} defaultMemoData={defaultMemo} />
  );
}