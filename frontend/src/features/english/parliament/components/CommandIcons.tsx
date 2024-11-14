import { FaList, FaListOl, FaParagraph } from "react-icons/fa";
import { ApplyCommandToAllEditors } from "../utils/editorCommandClass";
import { ImParagraphCenter, ImParagraphLeft, ImParagraphRight } from "react-icons/im";
import { MdHorizontalRule } from "react-icons/md";

import { Grid, GridItem, Icon, } from "@chakra-ui/react";
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "@/components/ui/popover";
import { CiSquareChevDown } from "react-icons/ci";


export default function CommandIcons({ unifiedCommands }:{ unifiedCommands: ApplyCommandToAllEditors }){

  const iconsWithCommand = [
    { icon: <FaParagraph />, command: () =>  unifiedCommands.setParagraph() },
    { icon: <ImParagraphLeft />, command: () =>  unifiedCommands.setTextLeft() },
    { icon: <ImParagraphCenter />, command: () =>  unifiedCommands.setTextCenter() },
    { icon: <ImParagraphRight />, command: () =>  unifiedCommands.setTextRight() },
    { icon: <FaList />, command: () =>  unifiedCommands.toggleBulletList() },
    { icon: <FaListOl />, command: () =>  unifiedCommands.toggleOrderedList() },
    { icon: <MdHorizontalRule />, command: () =>  unifiedCommands.setHorizontalRule() },
  ];

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Icon fontSize="40px" cursor="pointer">
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