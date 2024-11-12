import { auth } from "@/config/auth";
import Note from "@/features/english/parliament/components/Note";
import { getNoteWithCommand } from "@/features/english/parliament/utils/note";
import { getPostingsInNote } from "@/features/english/parliament/utils/posting";

// this component must be sever component because it call function to fetch resources to server.

export default async function Parliamentary(){
  let defaultNote;
  let defaultPostings;

  const session = await auth();

  if(session?.user){
    const latestNote = await getNoteWithCommand("latest");

    if(latestNote && !Array.isArray(latestNote)){ 
      defaultNote = {
        noteId: latestNote.noteId,
        title: latestNote.title,
        content: latestNote.content,
      };

      const postings = await getPostingsInNote(latestNote.noteId);

      defaultPostings = postings;
    }
  }  
  
  return (
    <Note defaultNote={defaultNote} defaultPostData={defaultPostings} />
  );
}