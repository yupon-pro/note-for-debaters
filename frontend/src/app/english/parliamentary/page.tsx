import { auth } from "@/config/auth";
import Note from "@/features/english/parliament/components/Note";
import { NoteData } from "@/features/english/parliament/types/note";
import { getNoteWithCommand } from "@/features/english/parliament/utils/note";

// this component must be sever component because it call function to fetch resources to server.

export default async function Parliamentary(){
  let defaultNote: NoteData = {
    content: `
      <table>
        <tbody>
          <tr>
            <td>OG</td>
            <td>OO</td>
          </tr>
          <tr>
            <td>CG</td>
            <td>CO</td>
          </tr>
        </tbody>
      </table>
      `,
  }

  const session = await auth();

  if(session?.user){
    const latestNote = await getNoteWithCommand("latest");
    if(latestNote && !Array.isArray(latestNote)){ 
      defaultNote = {
        noteId: latestNote.noteId,
        title: latestNote.title,
        content: latestNote.content,
      };
    }
  }  
  
  return (
    <Note defaultNote={defaultNote} />
  );
}