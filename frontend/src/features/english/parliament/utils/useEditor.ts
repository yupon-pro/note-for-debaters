import { Editor, useEditor } from "@tiptap/react";
import { CustomTableCell } from "@/features/english/parliament/components/CustomTableCell";
import Document from '@tiptap/extension-document'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"

export function useTableEditor(content?: string):Editor | null {
  return useEditor({
    immediatelyRender: false,
    extensions: [
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      StarterKit,
      Document, 
      Paragraph,
      Text,
      Gapcursor,
      Color,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
    ],
    content: content,
  });
}

export function useScriptEditor(content?: string):Editor | null{
  return useEditor({
    extensions: [
      StarterKit,
      Document, 
      Paragraph,
      Text,
      Gapcursor,
      Color,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
    ],
    content: content,
  })


}