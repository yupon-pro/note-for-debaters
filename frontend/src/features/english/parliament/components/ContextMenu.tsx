import { List } from "@chakra-ui/react";
import { Editor } from "@tiptap/react";

const tableMethodMenu = [
  { text: "上に行を追加", method: (editor: Editor) => { editor.commands.addRowBefore() } },
  { text: "下に行を追加", method: (editor: Editor) => { editor.commands.addRowAfter() } },
  { text: "左に列を追加", method: (editor: Editor) => { editor.commands.addColumnBefore() } },
  { text: "右に列を追加", method: (editor: Editor) => { editor.commands.addColumnAfter() } },
  { text: "行を削除", method: (editor: Editor) => { editor.commands.deleteRow() } },
  { text: "列を削除", method: (editor: Editor) => { editor.commands.deleteColumn() } },
];

export default function Contextmenu({ editor, top, left }: { editor: Editor, top:string, left:string  }){
  return (
  <List.Root
    top={top}
    left={left}
    position="fixed"
    padding="7px"
    minWidth="110px"
    minHeight="150px"
    border="1px solid gray"
    backgroundColor="#fff"
  >
    {tableMethodMenu.map((menu) => (
      <List.Item 
        key={menu.text} 
        onClick={ (e) => {
          e.preventDefault()
          e.stopPropagation()
          menu.method(editor)
        }} 
        cursor="pointer"
      > 
        {menu.text} 
      </List.Item>
    ))}
  </List.Root>
  );
}