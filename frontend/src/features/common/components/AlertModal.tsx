"use client";

import { dirtyAtom } from "@/jotai/editAtom";
import { useAtomValue } from "jotai";
import { useEffect, useCallback  } from "react";


export default function AlertModal(){
  const isDirty = useAtomValue(dirtyAtom);

  const confirmModal = useCallback((e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    }, [isDirty]);

  useEffect(() => {
    window.addEventListener("beforeunload", confirmModal);
    return () => window.removeEventListener("beforeunload", confirmModal);
  }, [confirmModal]);

  return null;
}