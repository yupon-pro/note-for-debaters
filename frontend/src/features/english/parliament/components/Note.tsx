"use client";

import { HStack, Icon, Input, VStack, } from "@chakra-ui/react";
import { MouseEvent,  useEffect,  useState } from "react";
import TableEditor from "./Table";
import { Button } from "@/components/ui/button";
import InsertTable from "./InsertTable";
import { NoteData } from "../types/note";
import { editNote, saveNote } from "../libs/clientNote";
import { useSession } from "next-auth/react";
import { ClientMemoData } from "@/types/memoType";
import { editMemos, saveMemos } from "../libs/clientMemo";
import Memo from "./Memo";
import { useScriptEditor, useTableEditor } from "../utils/useEditor";
import ScriptEditor from "./Script";
import { defaultColors, defaultNoteScript, defaultNoteTable } from "../consts/defautNoteConsts";
import { ApplyCommandToAllEditors } from "../utils/editorCommandClass";
import { FaBold, FaItalic } from "react-icons/fa";
import CommandIcons from "./CommandIcons";

export default function Note({defaultNoteData, defaultMemoData} :{ defaultNoteData?: NoteData, defaultMemoData?: ClientMemoData[] }){
  const [noteTitle, setNoteTitle] = useState(defaultNoteData?.title);
  const [memoData, setMemoData] = useState<ClientMemoData[]>(defaultMemoData || []);
  const noteId = defaultNoteData?.noteId;
  const { data: session } = useSession();

  const tableEditor = useTableEditor(defaultNoteData?.table);
  const scriptEditor = useScriptEditor(defaultNoteData?.script);
  const unifiedCommands = new ApplyCommandToAllEditors([ tableEditor, scriptEditor ]);

  useEffect(() => {
    // read the data and write if necessary.
    // we have the premise that the local saved data and server updated data are the same.
    const localSavedNoteTitle = localStorage.getItem("title");
    const localSavedNoteScript = localStorage.getItem("script");
    const localSavedNoteTable = localStorage.getItem("note");
    const localSavedMemoData = localStorage.getItem("memo");

    const isDefaultNoteTitle = !!defaultNoteData?.title;
    const isDefaultNoteScript = !!defaultNoteData?.script;
    const isDefaultNoteTable = !!defaultNoteData?.table;
    const isDefaultMemoData = !!defaultMemoData;

    if(!isDefaultNoteTitle && localSavedNoteTitle){
      setNoteTitle(localSavedNoteTitle);
    }

    if(!isDefaultNoteScript && localSavedNoteScript) {
      scriptEditor?.commands.setContent(localSavedNoteScript);

    }else if(!isDefaultNoteScript) {
      scriptEditor?.commands.setContent(defaultNoteScript);

    }

    if(!isDefaultNoteTable && localSavedNoteTable) {
      // If there is a default note data, the content is set to editor content.
      // this sentence aims to set content if there is no default data but local data exists.
      // I think this sentence works when the user doesn't sing up but use this project.
      tableEditor?.commands.setContent(localSavedNoteTable);

    }else if(!isDefaultNoteTable) {
      // If there is no local data and server data, the default data is set.
      // I think this sentence works when the user uses this for the first time or didn't save the previous note.
      tableEditor?.commands.setContent(defaultNoteTable);

    }

    if(!isDefaultMemoData && localSavedMemoData) {
      setMemoData(JSON.parse(localSavedMemoData));

    }

  }, [tableEditor, scriptEditor, defaultNoteData, defaultMemoData]);
  

  async function handleTextSave(){
    // save the note and memo.
    const noteTable = tableEditor?.getHTML();
    const noteScript = scriptEditor?.getHTML() || "";
    if(!noteTable || !noteTitle) return false;

    // While the data will be saved in local storage in every saving action,
    // server saving will take place only when the user has singed up.
    if(session?.user){
      const user = session.user;
      
      if(noteId) {
        await editNote({ noteId, title: noteTitle, table: noteTable, script: noteScript });

      }else{
        await saveNote({ user, title: noteTitle, table: noteTable, script: noteScript });

      }

      if(memoData.length){
        const saveData = memoData.map((memo) => ({
          ...memo, 
          user,
          x: memo.x.toString(),
          y: memo.y.toString(),
          width: memo.width.toString(),
          height: memo.height.toString(),
        }));

        const registers = saveData.filter((memo) => !memo.serverMemoId);
        const updates = saveData.filter((memo) => !!memo.serverMemoId);

        await saveMemos(registers);
        await editMemos(updates);

      }
    }
    
    localStorage.setItem("title", noteTitle);
    localStorage.setItem("table", noteTable);
    localStorage.setItem("script", noteScript);
    localStorage.setItem("memo", JSON.stringify(memoData));
  }

  function handleAddMemo(e: MouseEvent<HTMLButtonElement>){
    const id = crypto.randomUUID();
    const defaultData = {
      clientMemoId: id,
      noteId,
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
        <Input width={25} height={30} id="color-picker" type="color" onChange={(e) => unifiedCommands.setColor(e.target.value)} />
        <datalist id="color-picker">
          {defaultColors.map((color) => (
            <option key={color.code} value={color.code} />
          ))}
        </datalist>
        <Icon fontSize="30px" cursor="pointer" onClick={() => unifiedCommands.toggleBold()}>
          <FaBold />
        </Icon>
        <Icon fontSize="30px" cursor="pointer" onClick={() => unifiedCommands.toggleItalic()}>
          <FaItalic />
        </Icon>
        <CommandIcons unifiedCommands={unifiedCommands} />
        <Button colorScheme="teal" variant="solid" onClick={handleAddMemo} >memo</Button>
        <InsertTable editor={tableEditor} />
      </HStack>
      {memoData.length && memoData.map((memo) => (
        <Memo key={memo.clientMemoId} memoData={memo} setMemoData={setMemoData} />
      ))}
      <ScriptEditor editor={scriptEditor} />
      <TableEditor editor={tableEditor} />
    </VStack>
  );
}
