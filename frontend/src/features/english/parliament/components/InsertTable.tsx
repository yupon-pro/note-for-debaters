"use client";

import { Button } from "@/components/ui/button";
import { PopoverArrow, PopoverBody, PopoverContent } from "@/components/ui/popover";
import { PopoverRoot, PopoverTrigger, Table } from "@chakra-ui/react"
import { Dispatch, SetStateAction, useState } from "react"
import { TableSize } from "../types/tableSize";

const matrix = new Array(5).fill(0).map(() => [0, 0, 0, 0, 0])

export default function InsertTable({setInsertTableSize}: {setInsertTableSize: Dispatch<SetStateAction<TableSize>>}){
  const [highlight, setHighlight] = useState({ row: -1, column: -1 })
  function handleHighlight(row:number, column:number){
    setHighlight((prev) => ({...prev, row, column}));
  }
  return (
    <PopoverRoot>
      <PopoverTrigger asChild >
        <Button colorScheme="teal" size="sm" variant="solid" >Insert Table</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Table.Root borderSpacing={2} size="sm" variant="outline" onMouseLeave={() => setHighlight((prev) => ({...prev, row: -1, column: -1}))} >
            <Table.Body>
              {matrix.map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {row.map((_, cellIndex) => (
                    <Table.Cell 
                      key={`${rowIndex}-${cellIndex}`} 
                      onMouseOver={() => handleHighlight(rowIndex, cellIndex)} 
                      onDoubleClick={() => {
                        console.log("************************")
                        setInsertTableSize((prev) => ({...prev, row: highlight.row, column: highlight.column}))
                      }}
                      width={10}
                      height={10} 
                      border="1px solid black"
                      backgroundColor={ 
                        (rowIndex >= 0 && rowIndex <= highlight.row) && 
                        (cellIndex >= 0 && cellIndex <= highlight.column) ?
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
