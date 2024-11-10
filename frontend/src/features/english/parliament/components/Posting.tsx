"use client";

import { Dispatch, SetStateAction } from "react";
import { PostData, PostingProps } from "../types/posts";
import { Rnd } from "react-rnd";
import { RxCross1 } from "react-icons/rx";
import { Box, Textarea } from "@chakra-ui/react";

export default function Posting({
  id,
  postingProps, 
  setPostData
}: {
  id: string
  postingProps: PostingProps, 
  setPostData: Dispatch<SetStateAction<PostData | null>>
}){
return (
    <Rnd
      key={id}
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
        setPostData((prev) => !prev ? prev : ({...prev, [id]: {...prev[id], width: Number(ref.style.width), height: Number(ref.style.height) }}))
      }}
      onDragStop={(e, data,) => {
        setPostData((prev) => !prev ? prev : ({...prev, [id]: {...prev[id], x: data.x, y: data.y }}))
      }}
    >
      <Textarea
        id={id} 
        rows={10} 
        autoFocus={true}
        variant="flushed" 
        width="full" 
        height="full" 
        value={postingProps.content} 
        onChange={(e) => setPostData(prev => !prev ? prev : ({...prev, [id]: {...prev[id], content:e.target.value }}))} 
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setPostData((prev) => !prev ? prev : ({...prev, [id]: { ...prev[id], height: target.scrollHeight }}) )
        }}  
      />
      <Box 
        id={id}
        position="absolute"
        top={1} 
        right={0}
        width={7} 
        height={7}
        opacity={0.2} 
        _hover={{ opacity: 1, cursor: "pointer" }} 
        onDoubleClick={() => {
          setPostData((prev) => !prev ? prev : Object.fromEntries(Object.entries(prev).filter(([key,]) => key !== id )))
        }}
      >
        <RxCross1 size={20} />
      </Box>
    </Rnd>
  );
}