"use client";

import { Dispatch, SetStateAction } from "react";
import { PostData, PostingProps } from "../types/posts";
import { Rnd } from "react-rnd";
import { RxCross1 } from "react-icons/rx";
import { Box, Textarea } from "@chakra-ui/react";

export default function Posting({
  postingId,
  postingProps, 
  setPostData
}: {
  postingId: string
  postingProps: PostingProps, 
  setPostData: Dispatch<SetStateAction<PostData | null>>
}){
return (
    <Rnd
      key={postingId}
      style={{ 
        border: "1px solid black", 
        padding: 5,
        zIndex: 5,
        isolation: "isolate",
      }}
      default={{ 
        x: postingProps.x - 20,
        y: postingProps.y,
        width: postingProps.width, 
        height: postingProps.height,
      }} 
      onResizeStop={(e, direction, ref) => {
        setPostData((prev) => !prev ? prev : ({...prev, [postingId]: {...prev[postingId], width: Number(ref.style.width), height: Number(ref.style.height) }}))
      }}
      onDragStop={(e, data,) => {
        setPostData((prev) => !prev ? prev : ({...prev, [postingId]: {...prev[postingId], x: data.x, y: data.y }}))
      }}
    >
      <Textarea
        id={postingId} 
        rows={10} 
        autoFocus={true}
        variant="flushed" 
        width="full" 
        height="full" 
        value={postingProps.content} 
        onChange={(e) => setPostData(prev => !prev ? prev : ({...prev, [postingId]: {...prev[postingId], content:e.target.value }}))} 
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setPostData((prev) => !prev ? prev : ({...prev, [postingId]: { ...prev[postingId], height: target.scrollHeight }}) )
        }}  
      />
      <Box 
        id={postingId}
        position="absolute"
        top={1} 
        right={0}
        width={7} 
        height={7}
        opacity={0.2} 
        _hover={{ opacity: 1, cursor: "pointer" }} 
        onDoubleClick={() => {
          setPostData((prev) => !prev ? prev : Object.fromEntries(Object.entries(prev).filter(([key,]) => key !== postingId )))
        }}
      >
        <RxCross1 size={20} />
      </Box>
    </Rnd>
  );
}