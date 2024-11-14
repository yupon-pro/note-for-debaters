import { Editor } from "@tiptap/core";

export class ApplyCommandToAllEditors {
  private editors: (Editor | null)[];

  constructor(editors: (Editor | null)[]) {
    this.editors = editors;
  }

  toggleH1() { 
    for(const editor of this.editors){ 
      editor?.commands.toggleHeading({ level: 1 });
    } 
  }

  toggleH2() { 
    for(const editor of this.editors){ 
      editor?.commands.toggleHeading({ level: 2 });
    } 
  }

  toggleH3() { 
    for(const editor of this.editors){ 
      editor?.commands.toggleHeading({ level: 3 });
    } 
  }

  toggleBold(){ 
    for(const editor of this.editors){ 
      console.log(editor?.getText())
      editor?.commands.toggleBold();
    } 
  }

  toggleItalic() { 
    for(const editor of this.editors){ 
      editor?.commands.toggleItalic();
    } 
  }

  toggleStrike() { 
    for(const editor of this.editors){ 
      editor?.commands.toggleStrike();
    } 
  }

  toggleHighlight() { 
    for(const editor of this.editors){ 
      editor?.commands.toggleHighlight();
    } 
  }

  toggleBulletList(){
    for(const editor of this.editors){
      editor?.commands.toggleBulletList();
    }
  }

  toggleOrderedList(){
    for(const editor of this.editors){
      editor?.commands.toggleOrderedList();
    }
  }

  setColor(color: string){
    for(const editor of this.editors){
      editor?.commands.setColor(color);
    }
  }

  setParagraph() { 
    for(const editor of this.editors){ 
      editor?.commands.setParagraph();
    } 
  }

  setHorizontalRule() {
    for(const editor of this.editors){ 
      editor?.commands.setHorizontalRule();
    } 
  }

  setTextLeft(){ 
    for(const editor of this.editors){ 
      editor?.commands.setTextAlign('left');
    }
  }

  setTextCenter() { 
    for(const editor of this.editors){ 
      editor?.commands.setTextAlign('center');
    }
  }

  setTextRight() { 
    for(const editor of this.editors){ 
      editor?.commands.setTextAlign('right');
    }
  }
}
