"use client";

import { Dispatch, SetStateAction } from "react";
import { Rnd } from "react-rnd";
import { RxCross1 } from "react-icons/rx";
import { Box, Textarea } from "@chakra-ui/react";
import { removePosting } from "../utils/posting";
import { ClientPostData } from "@/types/postingType";

export default function Posting({
  postingId,
  postData, 
  setPostData
}: {
  postingId: string;
  postData: ClientPostData; 
  setPostData: Dispatch<SetStateAction<ClientPostData[] | null>>;
}){

  async function handleDeletePosting(){
    setPostData((prev) => !prev ? prev : prev.filter((post) => post.clientPostingId !== postingId) )
    await removePosting(postingId);
  }

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
        x: postData.x - 20,
        y: postData.y,
        width: postData.width, 
        height: postData.height,
      }} 
      onResizeStop={(e, direction, ref) => {
        setPostData((prev) => prev?.map((post) => post.clientPostingId !== postingId ? post : {
          ...post, 
          width: Number(ref.style.width), 
          height: Number(ref.style.height)
        }) || null);
      }}
      onDragStop={(e, data,) => {
        setPostData((prev) => prev?.map((post) => post.clientPostingId !== postingId ? post : {
          ...post, 
          x: data.x, 
          y: data.y
        }) || null);
      }}
    >
      <Textarea
        id={postingId} 
        rows={10} 
        autoFocus={true}
        variant="flushed" 
        width="full" 
        height="full" 
        value={postData.content} 
        onChange={(e) => 
          setPostData((prev) => prev?.map((post) => post.clientPostingId !== postingId ? post : {...post, content:e.target.value}) || null)
        } 
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setPostData((prev) => prev?.map((post) => post.clientPostingId !== postingId ? post : {...post, height: target.scrollHeight}) || null);
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
        onDoubleClick={handleDeletePosting}
      >
        <RxCross1 size={20} />
      </Box>
    </Rnd>
  );
}