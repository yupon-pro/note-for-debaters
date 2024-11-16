"use client";

import { FaList, FaListOl, FaParagraph } from "react-icons/fa";
import { ImParagraphCenter, ImParagraphLeft, ImParagraphRight } from "react-icons/im";
import { MdHorizontalRule, MdOutlineFormatQuote } from "react-icons/md";
import { Editor } from "@tiptap/react";
import { Grid, GridItem, Icon, } from "@chakra-ui/react";
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "@/components/ui/popover";
import { CiSquareChevDown } from "react-icons/ci";
import { useEffect, useState } from "react";
import { FaHighlighter } from "react-icons/fa6";


export default function SeparateCommandIcons({editors}: { editors: (Editor | null)[] }){
  const [separateEditor, setSeparateEditor] = useState<Editor | null>(null);

  useEffect(() => {
    for(const editor of editors){
      if(editor?.view.hasFocus()){
        setSeparateEditor(editor);
        return;
      }
    }

  }, [...editors.map((editor) => editor?.view.hasFocus())]);

  const iconsWithCommand = [
    { icon: <FaParagraph />, command: () =>  separateEditor?.commands.setParagraph() },
    { icon: <ImParagraphLeft />, command: () =>  separateEditor?.commands.setTextAlign("left") },
    { icon: <ImParagraphCenter />, command: () =>  separateEditor?.commands.setTextAlign("center") },
    { icon: <ImParagraphRight />, command: () =>  separateEditor?.commands.setTextAlign("right") },
    { icon: <FaList />, command: () =>  separateEditor?.commands.toggleBulletList() },
    { icon: <FaListOl />, command: () =>  separateEditor?.commands.toggleOrderedList() },
    { icon: <MdHorizontalRule />, command: () =>  separateEditor?.commands.setHorizontalRule() },
    { icon: <MdOutlineFormatQuote />, command: () => separateEditor?.commands.toggleBlockquote() },
    { icon: <FaHighlighter />, command: () => separateEditor?.commands.toggleHighlight() },
  ];

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Icon fontSize="40px" color="green" cursor="pointer">
          <CiSquareChevDown />
        </Icon>
      </PopoverTrigger>
      <PopoverContent width="125px">
        <PopoverArrow bgColor="white" />
        <PopoverBody bgColor="white" padding="12px">
          <Grid templateColumns="repeat(3, 1fr)" gap="2">
            {iconsWithCommand.map((data, index) => (
              <GridItem key={index} colSpan={1} m="0">
                <Icon 
                  display="block"
                  fontSize="20px" 
                  cursor="pointer"
                  color="green" 
                  onClick={() => data.command()}
                >
                { data.icon }
                </Icon>
              </GridItem>
            ))}
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}