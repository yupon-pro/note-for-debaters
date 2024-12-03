"use client";

import "@/features/english/parliament/styles/tableStyle.scss";
import { Editor, EditorContent, } from '@tiptap/react'
import { MouseEvent, useEffect, useState } from 'react'
import Contextmenu from "./ContextMenu";
import SelectMenu from "./SelectMenu";
import { useSetAtom } from "jotai";
import { dirtyAtom } from "@/jotai/editAtom";

export default function TableEditor({ editor }:{ editor: Editor | null }) {
  const setIsDirty = useSetAtom(dirtyAtom);
  editor?.on("update", () => setIsDirty(true)); // table change.
  const [displayMenu, setDisplayMenu] = useState({display:"none", top: "0", left: "0"});

  useEffect(() => {
    window.addEventListener("click", handleHide);
    return () => window.removeEventListener("click", handleHide);
  }, []);
  
  function handleShow(e: MouseEvent<HTMLDivElement>){
    e.preventDefault()
    setDisplayMenu((prev) => ({
      ...prev,
      display: "block",
      top: e.clientY + "px",
      left: e.clientX + "px",
    }));
  }

  function handleHide(){
    setDisplayMenu((prev) => ({
      ...prev,
      display: "none"
    }))
  }

  if (!editor) {
    return null
  }

  return (
    <>
      <EditorContent 
        className="note-table"
        editor={editor} 
        onContextMenu={handleShow}
        onFocus={() => editor?.chain().focus().run()}
      />
      <SelectMenu editor={editor} />
      {displayMenu.display === "block" && (
        <Contextmenu top={displayMenu.top} left={displayMenu.left} editor={editor} />
      )}
    </>
  )
}