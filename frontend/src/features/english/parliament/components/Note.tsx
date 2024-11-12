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
import InsertTable from "./InsertTable";
import { NoteData } from "../types/note";
import { editNote, saveNote } from "../utils/clientNote";
import { useSession } from "next-auth/react";
import { ClientMemoData } from "@/types/memoType";
import { editMemos, saveMemos } from "../utils/clientMemo";
import Memo from "./Memo";


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

export default function Note({ defaultNote, defaultMemoData} :{ defaultNote?: NoteData, defaultMemoData?: ClientMemoData[] }){
  const [noteTitle, setNoteTitle] = useState(defaultNote?.title || "");
  const [noteData, setNoteData] = useState<NoteData | null>(defaultNote || null);
  const [memoData, setMemoData] = useState<ClientMemoData[] | null>(defaultMemoData || null);
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
    const localSavedMemoData = localStorage.getItem("memo");

    const isDefaultTitle = !!defaultNote?.title;
    const isDefaultNoteData = !!defaultNote;
    const isDefaultMemoData = !!defaultMemoData;

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

    if(!isDefaultMemoData && localSavedMemoData) {
      setMemoData(JSON.parse(localSavedMemoData));

    }

  }, [editor, defaultNote, defaultMemoData]);
  

  async function handleTextSave(){
    // save the note and memo.
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

      if(memoData){
        const saveData = memoData.map((memo) => ({
          ...memo, 
          user,
          x: memo.x.toString(),
          y: memo.y.toString(),
          width: memo.width.toString(),
          height: memo.height.toString(),
        }));

        const registers = saveData.filter((memo) => !memo.serverMemoId);
        const updates = saveData.filter((memo) => !memo.serverMemoId);

        await saveMemos(registers);
        await editMemos(updates);

      }
    }
    

    localStorage.setItem("title", noteTitle);
    localStorage.setItem("note", noteContent);
    localStorage.setItem("memo", JSON.stringify(memoData));
  }

  function handleAddMemo(e: MouseEvent<HTMLButtonElement>){
    const id = crypto.randomUUID();
    const defaultData = {
      clientMemoId: id,
      noteId: noteData?.noteId,
      content: "memo",
      width: 200,
      height: 100,
      x:e.pageX,
      y:e.pageY
    }
    setMemoData((prev) => !prev ? ([defaultData]) : ([ ...prev, defaultData ]))
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
        <Button colorScheme="teal" variant="solid" onClick={handleAddMemo} >memo</Button>
        <InsertTable editor={editor} setNoteData={setNoteData} />
      </HStack>
      {memoData && Object.entries(memoData).map(([id, value]) => (
        <Memo key={id} memoId={id} memoData={value} setMemoData={setMemoData} />
      ))}
      <TableEditor editor={editor} />
    </VStack>
  );

}