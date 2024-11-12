"use client";

import { HStack, Input, VStack, } from "@chakra-ui/react";
import { MouseEvent,  useEffect,  useState } from "react";
import TableEditor from "./Table";
import { Button } from "@/components/ui/button";
import { useEditor } from "@tiptap/react";
import { CustomTableCell } from "./CustomTableCell";
import Document from '@tiptap/extension-document'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Posting from "./Posting";
import InsertTable from "./InsertTable";
import { NoteData } from "../types/note";
import { editNote, saveNote } from "../utils/note";
import { useSession } from "next-auth/react";
import { editPostings, savePostings } from "../utils/posting";
import { ClientPostData } from "@/types/postingType";

const defaultColors = [
  {label: "red",code:"#ff0000"},
  {label: "blue",code:"#00ff00"},
  {label: "black",code:"#0000ff"},
];

const defaultNoteContent =  `
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
  `;

export default function Note({ defaultNote, defaultPostData} :{ defaultNote?: NoteData, defaultPostData?: ClientPostData[] }){
  const [noteTitle, setNoteTitle] = useState(defaultNote?.title || "");
  const [noteData, setNoteData] = useState<NoteData | null>(defaultNote || null);
  const [postData, setPostData] = useState<ClientPostData[] | null>(defaultPostData || null);
  const { data: session } = useSession();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      Gapcursor,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      Color,
      TextStyle,
    ],
    content: noteData?.content,
  });

  useEffect(() => {
    // read the data and write if necessary.
    // we have the premise that the local saved data and server updated data are the same.
    const localSavedNoteTitle = localStorage.getItem("title");
    const localSavedNoteContent = localStorage.getItem("note");
    const localSavedPostData = localStorage.getItem("post");

    const isDefaultTitle = !!defaultNote?.title;
    const isDefaultNoteData = !!defaultNote;
    const isDefaultPostData = !!defaultPostData;

    if(!isDefaultTitle && localSavedNoteTitle){
      setNoteTitle(localSavedNoteTitle);

    }

    if(!isDefaultNoteData && localSavedNoteContent) {
      // If there is a default note data, the content is set to editor content.
      // this sentence aims to set content if there is no default data but local data exists.
      // I think this sentence works when the user doesn't sing up but use this project.
      setNoteData({ content: localSavedNoteContent });
      editor?.commands.setContent(localSavedNoteContent);

    }else if(!isDefaultNoteData) {
      // If there is no local data and server data, the default data is set.
      // I think this sentence works when the user uses this for the first time or didn't save the previous note.
      setNoteData({ content: defaultNoteContent });
      editor?.commands.setContent(defaultNoteContent);

    }

    if(!isDefaultPostData && localSavedPostData) {
      setPostData(JSON.parse(localSavedPostData));

    }

  }, [editor, defaultNote, defaultPostData]);
  

  async function handleTextSave(){
    // save the note and posting.
    const noteContent = editor?.getHTML();
    if(!noteContent || !noteData) return false;

    // While the data will be saved in local storage in every saving action,
    // server saving will take place only when the user has singed up.
    if(session?.user){
      const user = session.user;
      
      if(noteData.noteId) {
        await editNote({...noteData, title: noteTitle, noteId: noteData.noteId});

      }else{
        await saveNote({...noteData, title: noteTitle, user});

      }

      if(postData){
        const saveData = postData.map((post) => ({
          ...post, 
          user,
          x: post.x.toString(),
          y: post.y.toString(),
          width: post.width.toString(),
          height: post.height.toString(),
        }));

        const registers = saveData.filter((post) => !post.serverPostingId);
        const updates = saveData.filter((post) => !post.serverPostingId);

        await savePostings(registers);
        await editPostings(updates);

      }
    }
    

    localStorage.setItem("title", noteTitle);
    localStorage.setItem("note", noteContent);
    localStorage.setItem("post", JSON.stringify(postData));
  }

  function handleAddPosting(e: MouseEvent<HTMLButtonElement>){
    const id = crypto.randomUUID();
    const defaultData = {
      clientPostingId: id,
      noteId: noteData?.noteId,
      content: "posting",
      width: 200,
      height: 100,
      x:e.pageX,
      y:e.pageY
    }
    setPostData((prev) => !prev ? ([defaultData]) : ([ ...prev, defaultData ]))
  }

  return(
    <VStack>
      <HStack>
        <Input variant="flushed" type="text" placeholder="title" onChange={(e) => setNoteTitle(e.target.value)} value={noteTitle} />
        <Button colorScheme="teal" variant="solid" onClick={handleTextSave} >saved</Button>
        <label style={{ cursor: "pointer" }} htmlFor="color-picker">
          Color
        </label>
        <Input width={50} height={30} id="color-picker" type="color" onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()} />
        <datalist id="color-picker">
          {defaultColors.map((color) => (
            <option key={color.code} value={color.code} />
          ))}
        </datalist>
        <Button colorScheme="teal" variant="solid" onClick={handleAddPosting} >Posting</Button>
        <InsertTable editor={editor} setNoteData={setNoteData} />
      </HStack>
      {postData && Object.entries(postData).map(([id, value]) => (
        <Posting key={id} postingId={id} postData={value} setPostData={setPostData} />
      ))}
      <TableEditor editor={editor} />
    </VStack>
  );

}