import { auth } from "@/config/auth";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default async function Header(){
  const session = await auth();
  
  return(
    <header className="bg-teal-500 w-[90%] mx-auto">
      <div className="flex justify-between items-center p-6">
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
          <div>
            <Link href="/auth/login" className="cursor-pointer rounded bg-blue-200 hover:bg-blue-400 flex justify-between items-center p-6">
              <p>Login</p>
              <FaArrowRight size={60} className="absolute top-0 right-0 hover:right-4" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}