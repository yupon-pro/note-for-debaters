import { Icon, Input, VStack } from "@chakra-ui/react";
import { Editor } from "@tiptap/react";
import { defaultColors } from "../consts/defautNoteConsts";
import { PiTextAa, PiTextBBold, PiTextItalic, PiTextUnderline } from "react-icons/pi";


export default function CooperativeCommandIcons({ editors }: { editors: (Editor | null)[] }){
  const iconsWithCommand = [
    { icon: <PiTextBBold /> , command: () => editors.forEach((editor) => editor?.commands.toggleBold()) },
    { icon: <PiTextItalic /> , command: () => editors.forEach((editor) => editor?.commands.toggleItalic()) },
    { icon: <PiTextUnderline />, command: () => editors.forEach((editor) => editor?.commands.toggleUnderline()) },
  ];

  return(
    <>
      <TextColor editors={editors} />
      { iconsWithCommand.map((data, index) => (
        <Icon 
          key={index} 
          fontSize="25px" 
          cursor="pointer"
          color="green" 
          onClick={() => data.command }
        >
          { data.icon }
        </Icon>
      )) }
    </>
  );

}

function TextColor({ editors }: { editors: (Editor | null)[] }){
  return (
    <VStack gap={0}>
      <label style={{ cursor: "pointer" }} htmlFor="color-picker">
        <Icon fontSize="25px">
          <PiTextAa />
        </Icon>
      </label>
      <Input 
        height="5px" 
        id="color-picker" 
        type="color"
        onChange={(e) =>  editors.forEach((editor) => editor?.commands.setColor(e.target.value)) } 
      />
      <datalist id="color-picker">
        {defaultColors.map((color) => (
          <option key={color.code} value={color.code} />
        ))}
      </datalist>
    </VStack>
  );
}