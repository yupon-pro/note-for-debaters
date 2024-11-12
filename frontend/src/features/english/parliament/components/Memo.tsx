"use client";

import { Dispatch, SetStateAction } from "react";
import { Rnd } from "react-rnd";
import { RxCross1 } from "react-icons/rx";
import { Box, Textarea } from "@chakra-ui/react";
import { removeMemo } from "../utils/clientMemo";
import { ClientMemoData } from "@/types/memoType";

export default function Memo({
  memoId,
  memoData, 
  setMemoData
}: {
  memoId: string;
  memoData: ClientMemoData; 
  setMemoData: Dispatch<SetStateAction<ClientMemoData[] | null>>;
}){

  async function handleDeleteMemo(){
    setMemoData((prev) => !prev ? prev : prev.filter((memo) => memo.clientMemoId !== memoId) )
    await removeMemo(memoId);
  }

  return (
    <Rnd
      key={memoId}
      style={{ 
        border: "1px solid black", 
        padding: 5,
        zIndex: 5,
        isolation: "isolate",
      }}
      default={{ 
        x: memoData.x - 20,
        y: memoData.y,
        width: memoData.width, 
        height: memoData.height,
      }} 
      onResizeStop={(e, direction, ref) => {
        setMemoData((prev) => prev?.map((memo) => memo.clientMemoId !== memoId ? memo : {
          ...memo, 
          width: Number(ref.style.width), 
          height: Number(ref.style.height)
        }) || null);
      }}
      onDragStop={(e, data,) => {
        setMemoData((prev) => prev?.map((memo) => memo.clientMemoId !== memoId ? memo : {
          ...memo, 
          x: data.x, 
          y: data.y
        }) || null);
      }}
    >
      <Textarea
        id={memoId} 
        rows={10} 
        autoFocus={true}
        variant="flushed" 
        width="full" 
        height="full" 
        value={memoData.content} 
        onChange={(e) => 
          setMemoData((prev) => prev?.map((memo) => memo.clientMemoId !== memoId ? memo : {...memo, content:e.target.value}) || null)
        } 
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setMemoData((prev) => prev?.map((memo) => memo.clientMemoId !== memoId ? memo : {...memo, height: target.scrollHeight}) || null);
        }}  
      />
      <Box 
        id={memoId}
        position="absolute"
        top={1} 
        right={0}
        width={7} 
        height={7}
        opacity={0.2} 
        _hover={{ opacity: 1, cursor: "pointer" }} 
        onDoubleClick={handleDeleteMemo}
      >
        <RxCross1 size={20} />
      </Box>
    </Rnd>
  );
}