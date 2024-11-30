"use client";

import { VStack } from "@chakra-ui/react";
import { NoteInfo } from "../types/NoteList";
import NoteCard from "./NoteCard";
import Link from "next/link";

export default function MyPage({ noteInfo }: { noteInfo: NoteInfo[] }) {
  return (
    <VStack>
      {noteInfo.map((note) => (
        <Link href={`/english/parliamentary/${note.noteId}`} key={note.noteId}>
          <NoteCard  noteInfo={note} />
        </Link>
      ))}
    </VStack>
  );
}