"use client";

import "@/features/english/parliament/styles/tableStyles.scss";


import { Editor, EditorContent, } from '@tiptap/react'
import { MouseEvent, useEffect, useState } from 'react'
import Contextmenu from "./ContextMenu";

export default function TableEditor({editor}:{editor:Editor|null}) {
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
      top: e.pageY + "px",
      left: e.pageX + "px",
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
        editor={editor} 
        className="tiptap" 
        onContextMenu={handleShow}
      />
      { displayMenu.display === "block" && (<Contextmenu top={displayMenu.top} left={displayMenu.left} editor={editor} />)}

    </>
  )
}