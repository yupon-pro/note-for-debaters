"use client";

import "@/features/english/parliament/styles/basicStyle.scss";
import { HStack,  Input, VStack, } from "@chakra-ui/react";
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
import { useScriptEditor, useTableEditor } from "../hooks/useEditor";
import ScriptEditor from "./Script";
import { defaultNoteScript, defaultNoteTable } from "../consts/defautNoteConsts";
import SeparateCommandIcons from "./SeparateCommandIcons";
import TransitionDetection from "@/features/common/components/TransitionDetection";
import CooperativeCommandIcons from "./CooperativeCommandIcons";
import { Toaster, toaster } from "@/components/ui/toaster";

export default function Note({defaultNoteData, defaultMemoData} :{ defaultNoteData?: NoteData, defaultMemoData?: ClientMemoData[] }){
  const [noteTitle, setNoteTitle] = useState(defaultNoteData?.title);
  const [memoData, setMemoData] = useState<ClientMemoData[]>(defaultMemoData || []);
  const noteId = defaultNoteData?.noteId;
  const { data: session } = useSession();

  const tableEditor = useTableEditor(defaultNoteData?.table);
  const scriptEditor = useScriptEditor(defaultNoteData?.script);

  useEffect(() => {
    // [Notion]
    // read the data and write if necessary.
    // we have the premise that the local saved data and server updated data are the same.
    const localSavedNoteTitle = localStorage.getItem("title");
    const localSavedNoteScript = localStorage.getItem("script");
    const localSavedNoteTable = localStorage.getItem("table");
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
  

  async function handleTextSave(bakeToast?: boolean){
    // save the note and memo.
    const noteTable = tableEditor?.getHTML();
    const noteScript = scriptEditor?.getHTML() || "";
    if(!noteTable || !noteTitle) return;
    // [Notion]
    // While the data will be saved in local storage in every saving action,
    // server saving will take place only when the user has singed up.
    if(session?.user){
      const user = session.user;
      let noteAction;
      if(noteId) {
        noteAction = async () => await editNote({ noteId, title: noteTitle, table: noteTable, script: noteScript });
      }else{
        noteAction = async () => await saveNote({ userId: user.id, title: noteTitle, table: noteTable, script: noteScript });
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

        if(!bakeToast) return;
        toaster.promise(Promise.all([noteAction(), saveMemos(registers), editMemos(updates)]), {
          success: {
            title: "Successfully saved!",
            description: "Looks great",
          },
          error: {
            title: "Saved failed",
            description: "Something wrong with the save",
          },
          loading: { title: "saving...", description: "Please wait" },
        });
      }
    }else{
      if(!bakeToast) return;
      toaster.create({
        title: "Your date is saved only locally.",
        type: "success",
      });
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
      content: "memo\n\n\n",
      width: 300,
      height: 200,
      x:e.pageX - 150,
      y:e.pageY - 100,
    }
    setMemoData((prev) => !prev ? ([defaultData]) : ([ ...prev, defaultData ]))
  }

  return(
    <>
      <VStack>
        <HStack px={1} w="full" justifyContent="space-between">
          <Input
            display="block" 
            width={{ md: "25%", lg: "30%", xl: "30%" }}
            variant="flushed" 
            type="text" 
            placeholder="title" 
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}  
          />
          <HStack 
            width={{ md: "40%", lg: "50%", xl: "60%" }}
            justifyContent="flex-end" 
            gap={5} 
          >
            <Button colorScheme="teal" variant="solid" onClick={() => handleTextSave(true)} >saved</Button>
            <CooperativeCommandIcons editors={[ scriptEditor, tableEditor ]} />
            <SeparateCommandIcons editors={[ scriptEditor, tableEditor ]} />
            <Button colorScheme="teal" variant="solid" onClick={handleAddMemo} >memo</Button>
            <InsertTable editor={tableEditor} />
          </HStack>
        </HStack>
        {!!memoData.length && memoData.map((memo) => (
          <Memo key={memo.clientMemoId} memoData={memo} setMemoData={setMemoData} />
        ))}
        <ScriptEditor editor={scriptEditor} />
        <TableEditor editor={tableEditor} />
      </VStack>
      <Toaster  />
      <TransitionDetection callable={handleTextSave} />
    </>
  );
}
