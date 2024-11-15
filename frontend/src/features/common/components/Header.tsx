import { auth } from "@/config/auth";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default async function Header(){
  const session = await auth();
  
  return(
    <header className="bg-teal-500 rounded w-full mx-auto">
      <div className="flex justify-between items-center p-[10px]">
        <div>
          Note For Debaters
        </div>
        {!!session?.user ? (
          <div className="flex justify-between items-center p-6">
            <Link href="/mypage" className="cursor-pointer rounded bg-blue-200 hover:bg-blue-400 flex justify-between items-center p-6" >
              <p>My Page</p>
              <IoPerson size={60} />
            </Link>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" >
              log out
            </button>
          </div>
        ) : (
          <div 
            className="
              relative 
              cursor-pointer 
              border-solid 
              border-2 
              border-sky-500 rounded 
              bg-blue-200 
              hover:bg-blue-400 
              flex 
              justify-between 
              items-center 
              p-3
              w-50
              "
            >
            <Link href="/auth/login" >
              <p>Login</p>
            </Link>
            <FaArrowRight size={15} color="skyblue" />
          </div>
        )}
      </div>
    </header>
  );
}