"use client";

import { useEffect } from "react";

interface CallableFunction {
  (): Promise<void>;
}

export default function TransitionDetection<T extends CallableFunction>({ callable }: { callable: T }){
  useEffect(() => {
    const callFunctionBeforeAction = async() => await callable();
    window.addEventListener("beforeunload", callFunctionBeforeAction);
    return () => window.removeEventListener("beforeunload", callFunctionBeforeAction);
  }, [callable]);

  return null;
}