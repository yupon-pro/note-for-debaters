"use client";

import { HStack, Input, VStack, } from "@chakra-ui/react";
import { MouseEvent,  useEffect,  useState } from "react";
import TableEditor from "./Table";
import { Button } from "@/components/ui/button";
import { useEditor } from "@tiptap/react";
import { CustomTableCell } from "./CustomTableCell";
import Document from '@tiptap/extension-document'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { PostData } from "../types/posts";
import Posting from "./Posting";
import InsertTable from "./InsertTable";
import { renderToString } from "react-dom/server";

const defaultColors = [
  {label: "red",code:"#ff0000"},
  {label: "blue",code:"#00ff00"},
  {label: "black",code:"#0000ff"},
];

export default function Note({defaultContent, defaultPostData}:{defaultContent?: string, defaultPostData?: PostData}){
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(defaultContent);
  const [postData, setPostData] = useState<PostData|null>( defaultPostData || null);
  const [insertTableSize, setInsertTableSize] = useState({ row: -1, column: -1});

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
      Color,
      TextStyle,
    ],
    content,
  });

  useEffect(() => {
    const content = localStorage.getItem("note");
    const postData = localStorage.getItem("post");
    setContent((prev) => content ? content : prev);
    setPostData((prev) => postData ? JSON.parse(postData) : prev);
    if(content) editor?.commands.setContent(content);
  }, [editor]);

  useEffect(() => {
    if(insertTableSize.row === -1 || insertTableSize.column === -1) return;
    const content = (
      <table>
        <tbody>
          {new Array(insertTableSize.row + 1).fill(0).map((row) => (
            <tr key={row}>
              {new Array(insertTableSize.column + 1).fill(0).map((column) => (
                <td key={`${row}-${column}`}>
                  New Table
                </td>
              ))}
            </tr>
            )
          )}
        </tbody>
      </table>
    );
    const contentHTML = renderToString(content)
    editor?.commands.clearContent();
    editor?.commands.setContent(contentHTML);
    setContent(contentHTML);
  }, [editor,  insertTableSize])


  async function handleTextSave(){
    const content = editor?.getHTML();

    if(content) localStorage.setItem("note", content);
    localStorage.setItem("post", JSON.stringify(postData))
  }

  function handleAddPosting(e: MouseEvent<HTMLButtonElement>){
    const id = crypto.randomUUID();
    const defaultData = {
      content: "posting",
      width: 200,
      height: 100,
      x:e.pageX,
      y:e.pageY
    }
    setPostData((prev) => ({...prev, [id]: defaultData}))
  }

  return(
    <VStack>
      <HStack>
        <Input variant="flushed" type="text" placeholder="title" onChange={(e) => setTitle(e.target.value)} value={title} />
        <Button colorScheme="teal" variant="solid" onClick={handleTextSave} >saved</Button>
        <label style={{ cursor: "pointer" }} htmlFor="color-picker">
          Color
        </label>
        <Input width={50} height={30} id="color-picker" type="color" onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()} />
        <datalist id="color-picker">
          {defaultColors.map((color) => (
            <option key={color.code} value={color.code} />
          ))}
        </datalist>
        <Button colorScheme="teal" variant="solid" onClick={handleAddPosting} >Posting</Button>
        <InsertTable setInsertTableSize={setInsertTableSize} />
      </HStack>
      {postData && Object.entries(postData).map(([id, value]) => (
        <Posting key={id} postingId={id} postingProps={value} setPostData={setPostData} />
      ))}
      <TableEditor editor={editor} />
    </VStack>
  );

}