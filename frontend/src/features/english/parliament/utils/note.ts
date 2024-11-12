import { getLatestNote, getNote, getNotes, postNote, updateNote } from "@/libs/debateNote";
import { PostNote, UpdateNote } from "@/types/noteType";

export async function getNoteWithCommand(command: "latest" | "single" | "multiple", id?: string) {
  let data;
  switch (command) {
    case "latest":
      data = await getLatestNote();
      break;

    case "single":
      if(id){
        data = await getNote(id);
      }
      break;
    
    case "multiple":
      data = await getNotes();
      break;
  
    default:
      break;
  }
  return data;
}

export async function saveNote(note: PostNote){
  await postNote(note);

};

export async function editNote(note: UpdateNote){
  await updateNote(note);
}

export async function removeNote(){}