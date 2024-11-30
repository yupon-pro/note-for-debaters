import { getNotes } from "@/libs/debateNote";

export async function getNoteList(){
  try{
    const notes = await getNotes();
    const noteOutlineList = notes.map((note) => ({
      noteId: note.noteId,
      title: note.title,
      script: note.script,
      updatedAt: note.updatedAt,
    }))
    return noteOutlineList

  }catch(error){
    throw error
  }
}