
import { ReactNode } from "react";
import Header from "./Header";

export default function StyleWithHeader({ children }: { children: ReactNode }){
  return (
    <main className="h-full grid gap-4 grid-cols-1 px-2 py-4" >
      <Header />
      <div className="px-2 py-2 bg-gray-100 rounded border-solid border-gray-200 border-2">
        {children}
      </div>
    </main>
  );
}