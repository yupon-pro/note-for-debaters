import "@/features/english/parliament/styles/scriptStyle.scss";
import { Editor, EditorContent } from "@tiptap/react";
import SelectMenu from "./SelectMenu";

export default function ScriptEditor({ editor }: { editor: Editor | null }){
  return (
    <>
      <EditorContent className="note-script" editor={editor} onFocus={() => editor?.chain().focus().run() } />
      <SelectMenu editor={editor} />
    </>
  );
}