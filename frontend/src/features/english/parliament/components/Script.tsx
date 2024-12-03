import "@/features/english/parliament/styles/scriptStyle.scss";
import { Editor, EditorContent } from "@tiptap/react";
import SelectMenu from "./SelectMenu";
import { useSetAtom } from "jotai";
import { dirtyAtom } from "@/jotai/editAtom";
import { CSSProperties } from "react";

export default function ScriptEditor({ 
  editor, 
  cssProps, 
}: { 
  editor: Editor | null, 
  cssProps?: CSSProperties 
}){
  const setIsDirty = useSetAtom(dirtyAtom);
  editor?.on("update", () => setIsDirty(true)); // script change.

  return (
    <>
      <EditorContent
        style={cssProps} 
        className="note-script" 
        editor={editor} 
        onFocus={() => editor?.chain().focus().run() } 
      />
      <SelectMenu editor={editor} />
    </>
  );
}