import "@/features/english/parliament/styles/scriptStyle.scss";
import { Editor, EditorContent } from "@tiptap/react";
import SelectMenu from "./SelectMenu";
import { useSetAtom } from "jotai";
import { dirtyAtom } from "@/jotai/editAtom";

export default function ScriptEditor({ editor }: { editor: Editor | null }){
  const setIsDirty = useSetAtom(dirtyAtom);
  editor?.on("update", () => setIsDirty(true)); // script change.

  return (
    <>
      <EditorContent 
        className="note-script" 
        editor={editor} 
        onFocus={() => editor?.chain().focus().run() } 
      />
      <SelectMenu editor={editor} />
    </>
  );
}