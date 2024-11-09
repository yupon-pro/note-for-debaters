import TableCell from "@tiptap/extension-table-cell";
import { Editor } from "@tiptap/react";

export const CustomTableCell = TableCell.extend({
  // addAttributes() {
  //     return{
  //       ...this.parent?.(),
  //       menuDisplay: {
  //         default: "none",
  //       },
  //       menuLeft:{
  //         default: "0",
  //       },
  //       menuTop: {
  //         default: "0",
  //       }
  //     }
  // },

  // parseHTML() {
  //     return [
  //       {
  //         tag: "td"
  //       }
  //     ]
  // },

  // renderHTML({ HTMLAttributes }) {
  //     return ["td", mergeAttributes(HTMLAttributes)]
  // },

  addNodeView() {
    return ({ editor }) => {
      // const { view } = editor;
      // セル全体のコンテナを作成
      const container = document.createElement("td");
      container.classList.add("custom-table-cell");

      // const contextmenu = document.createElement("div");
      // contextmenu.classList.add("context-menu");
      // const ul = document.createElement("ul");
      // tableMethodMenu.forEach((list) => {
      //   const li = document.createElement("li");
      //   const text = document.createTextNode(list.text);
      //   li.appendChild(text);
      //   li.addEventListener("click", () => list.method(editor));
      //   ul.appendChild(li);
      // });
      // contextmenu.appendChild(ul);

      // contextmenu.style.display = node.attrs.menuDisplay;
      // contextmenu.style.left = node.attrs.menuLeft;
      // contextmenu.style.top = node.attrs.menuTop;

      // container.addEventListener("contextmenu", (e) => {
      //   e.preventDefault();
      //   view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, {
      //     ...node.attrs,
      //     menuDisplay: "block",
      //     menuTop: e.pageY + "px",
      //     menuLeft: e.pageX + "px",
      //   }));
      //   editor.commands.focus();
      // });
        
      // container.addEventListener("mouseleave", () => {
      //   view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, {
      //     ...node.attrs,
      //     menuDisplay: "none",
      //     menuTop: "0",
      //     menuLeft: "0",
      //   }));
      //   contextmenu.style.display = "none";
      //   editor.commands.focus();
      // });

      const upperArea = document.createElement("div");
      upperArea.classList.add("hover-area");
      upperArea.classList.add("upper-area");
      upperArea.addEventListener("dblclick", () => handleClickUpperArea(editor));

      const bottomArea = document.createElement("div");
      bottomArea.classList.add("hover-area");
      bottomArea.classList.add("bottom-area");
      bottomArea.addEventListener("dblclick", () => handleClickBottomArea(editor));

      const rightArea = document.createElement("div");
      rightArea.classList.add("hover-area");
      rightArea.classList.add("right-area");
      rightArea.addEventListener("dblclick", () => handleClickRightArea(editor));

      const leftArea = document.createElement("div");
      leftArea.classList.add("hover-area");
      leftArea.classList.add("left-area");
      leftArea.addEventListener("dblclick", () => handleClickLeftArea(editor));

      // TipTap のコンテンツを表示するための要素を作成
      const contentDiv = document.createElement("div");
      contentDiv.classList.add("content");

      // DOM構造をセットアップ
      container.appendChild(upperArea);
      container.appendChild(bottomArea);
      container.appendChild(rightArea);
      container.appendChild(leftArea);
      // container.appendChild(contextmenu);
      container.appendChild(contentDiv); // コンテンツエリアを追加

      return {
        dom: container,
        contentDOM: contentDiv,
        update() {
          // if (updateNode.attrs.menuDisplay !== node.attrs.menuDisplay || 
          //   updateNode.attrs.menuLeft !== node.attrs.menuLeft || 
          //   updateNode.attrs.menuTop !== node.attrs.menuTop) {
          // contextmenu.style.display = updateNode.attrs.menuDisplay;
          // contextmenu.style.left = updateNode.attrs.menuLeft;
          // contextmenu.style.top = updateNode.attrs.menuTop;
          // }
          return true;
        },
      };
    };
  },
});

function handleClickUpperArea(editor: Editor){
  editor.commands.addRowBefore()
}
function handleClickBottomArea(editor: Editor){
  editor.commands.addRowAfter();
}

function handleClickLeftArea(editor: Editor){
  editor.commands.addColumnBefore();
}

function handleClickRightArea(editor: Editor){
  editor.commands.addColumnAfter();
}