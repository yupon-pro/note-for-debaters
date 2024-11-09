"use client";

import "@/features/english/parliament/styles/tableStyles.scss";

import Document from '@tiptap/extension-document'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { MouseEvent, useEffect, useState } from 'react'
import { CustomTableCell } from "./CustomTableCell";
import Contextmenu from "./ContextMenu";

export default function GridNote () {
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
    ],
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
  })

  if (!editor) {
    return null
  }

  return (
    <>
      d
      <EditorContent 
        editor={editor} 
        className="tiptap" 
        onContextMenu={handleShow} 
      />
      { displayMenu.display === "block" && (<Contextmenu top={displayMenu.top} left={displayMenu.left} editor={editor} />)}

    </>
  )
}