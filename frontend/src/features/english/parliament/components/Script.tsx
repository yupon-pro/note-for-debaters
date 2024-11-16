import "@/features/english/parliament/styles/scriptStyles.scss";
import { Editor, EditorContent } from "@tiptap/react";

export default function ScriptEditor({ editor }: { editor: Editor | null }){
  return (
    <>
      <EditorContent className="script" editor={editor} />
    </>
  );
}