"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { Rnd } from "react-rnd";
import { RxCross1 } from "react-icons/rx";
import { Box, Textarea } from "@chakra-ui/react";
import { removeMemo } from "../libs/clientMemo";
import { ClientMemoData } from "@/types/memoType";
import { dirtyAtom } from "@/jotai/editAtom";
import { useSetAtom } from "jotai";

export default function Memo({
  memoData, 
  setMemoData
}: {
  memoData: ClientMemoData; 
  setMemoData: Dispatch<SetStateAction<ClientMemoData[]>>;
}){
  const setIsDirty = useSetAtom(dirtyAtom)

// ウィンドウリサイズ時の補正
useEffect(() => {
  const handleResize = () => {
    setMemoData((prev) =>
      prev.map((memo) => {
        const parent = window.document.getElementById("note");
        console.log(parent);
        if (!parent) return memo;

        const parentRect = parent.getBoundingClientRect();
        const newX = Math.min(
          Math.max(0, memo.x),
          parentRect.width - memo.width
        );
        // const newX = memo.x + memo.width > parentRect.width ? parentRect.width - memo.width : memo.x

        const newY = Math.min(
          Math.max(0, memo.y),
          parentRect.height - memo.height
        );

        return { ...memo, x: newX, y: newY };
      })
    );
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [setMemoData]);


  // [Notion]
  // Memo's parental component is Note. 
  // If you want to user "bounds='parent'" to make memo move freely, pay to the hierarchy
  async function handleDeleteMemo(){
    setIsDirty(true) // memo changed (delete)
    setMemoData((prev) => prev.filter((memo) => memo.clientMemoId !== memoData.clientMemoId));
    if(memoData.serverMemoId) await removeMemo(memoData.serverMemoId);
  }

  return (
    <Rnd
      key={memoData.clientMemoId}
      style={{ 
        border: "1px solid black", 
        padding: 5,
        zIndex: 5,
        // isolation: "isolate",
      }}
      position={{
        x: memoData.x,
        y: memoData.y,
      }}
      size={{
        width: memoData.width,
        height: memoData.height
      }}
      maxHeight="450px"
      bounds="parent"
      onResizeStop={(e, direction, ref) => {
        setIsDirty(true) // memo changed. (edit size)
        setMemoData((prev) => prev.map((memo) => memo.clientMemoId !== memoData.clientMemoId ? memo : {
          ...memo, 
          width: Number(ref.style.width), 
          height: Number(ref.style.height)
        }));
      }}
      onDragStop={(e, data,) => {
        setIsDirty(true) // memo changed. (edit position)
        setMemoData((prev) => prev.map((memo) => memo.clientMemoId !== memoData.clientMemoId ? memo : {
          ...memo, 
          x: data.x, 
          y: data.y
        }));
      }}
    >
      <Textarea
        id={memoData.clientMemoId} 
        rows={10} 
        autoFocus={true}
        variant="flushed" 
        width="full" 
        height="full" 
        value={memoData.content} 
        onChange={(e) => {
          setIsDirty(false) // memo changed. (edit content)
          setMemoData((prev) => prev.map((memo) => 
            memo.clientMemoId !== memoData.clientMemoId ? memo : {...memo, content:e.target.value}))
        }} 
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setMemoData((prev) => prev.map((memo) => 
            memo.clientMemoId !== memoData.clientMemoId ? memo : {...memo, height: target.scrollHeight}));
        }}  
      />
      <Box 
        id={memoData.clientMemoId}
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