"use client";

import { Button } from "@/components/ui/button";
import { PopoverArrow, PopoverBody, PopoverContent } from "@/components/ui/popover";
import { PopoverRoot, PopoverTrigger, Table } from "@chakra-ui/react"
import { Dispatch, SetStateAction, useState } from "react"
import { renderToString } from "react-dom/server";
import { NoteData } from "../types/note";
import { Editor } from '@tiptap/react'

const matrix = new Array(5).fill(0).map(() => [0, 0, 0, 0, 0])

export default function InsertTable({ 
  editor, 
  setNoteData 
}: {
  editor: Editor | null, 
  setNoteData: Dispatch<SetStateAction<NoteData | null>> 
}){
  const [highlight, setHighlight] = useState({ row: -1, column: -1 });

  function handleHighlight(row:number, column:number){
    setHighlight((prev) => ({...prev, row, column}));
  }

  function handleInsertTable(){
    if(highlight.row === -1 || highlight.column === -1) return;

    const content = (
      <table>
        <tbody>
          {new Array(highlight.row + 1).fill(0).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {new Array(highlight.column + 1).fill(0).map((_, columnIndex) => (
                <td key={`${rowIndex}-${columnIndex}`}>
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
    setNoteData((prev) => ({ ...prev, content: contentHTML}));
  }

  return (
    <PopoverRoot>
      <PopoverTrigger asChild >
        <Button colorScheme="teal" size="sm" variant="solid" >Insert Table</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Table.Root 
            borderSpacing={2} 
            size="sm" 
            variant="outline" 
            onMouseLeave={() => setHighlight((prev) => ({...prev, row: -1, column: -1}))} 
          >
            <Table.Body>
              {matrix.map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {row.map((_, cellIndex) => (
                    <Table.Cell 
                      key={`${rowIndex}-${cellIndex}`} 
                      onMouseOver={() => handleHighlight(rowIndex, cellIndex)} 
                      onDoubleClick={handleInsertTable}
                      width={10}
                      height={10} 
                      border="1px solid black"
                      backgroundColor={ 
                        ( 0 <= rowIndex && rowIndex <= highlight.row) && 
                        ( 0 <= cellIndex && cellIndex <= highlight.column) ?
                        "white" : "gray.500"
                      }
                    >
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}
