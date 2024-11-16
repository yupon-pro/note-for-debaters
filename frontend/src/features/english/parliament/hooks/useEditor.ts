import { Editor, mergeAttributes, Node, useEditor } from "@tiptap/react";
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
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";

const commonExtension = [
  StarterKit,
  Document, 
  Paragraph,
  Text,
  Gapcursor,
  Color,
  Italic,
  TextStyle,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Highlight,
  Underline,
];

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
      ...commonExtension
    ],
    content: content,
  });
}

export function useScriptEditor(content?: string):Editor | null{
  return useEditor({
    extensions: commonExtension,
    content: content,
  })
}