"use client";

import { Box, Card, Heading } from "@chakra-ui/react";
import { NoteInfo } from "../types/NoteList";

export default function NoteCard({ noteInfo }: { noteInfo: NoteInfo }) {

  return(
    <Card.Root 
      size="md" 
      variant="elevated"
      bgColor="gray.200" 
      _hover={{ bgColor: "gray.100" }}
    >
      <Card.Header>
        <Heading size="md"> {noteInfo.title || "no title"} </Heading>
      </Card.Header> 
      <Card.Body color="fg.muted" >
        <Box dangerouslySetInnerHTML={{ __html: noteInfo.script }} />
      </Card.Body>
    </Card.Root>
  )
}