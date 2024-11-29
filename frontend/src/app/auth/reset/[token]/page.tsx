import ResetForm from "@/features/auth/reset/ResetForm";
import { authenticateToken } from "@/libs/auth";
import Link from "next/link";

export default async function Page({
  params
}: {
  params: { token: string }
}){
  const { token } = params;
  const userId = await authenticateToken(token);
  if(!userId) return <InvalidTokenNotify /> ;

  return (
    <ResetForm userId={userId} token={token} />
  );
}

function InvalidTokenNotify(){
  return (
    <div className="h-full w-full flex justify-around items-center">
      <div>
        <h2 className="text-red-500" >
          <strong>
            INVALID
          </strong>
        </h2>
      </div>
      <div>
        <p>Your accessed url is invalid. You may have written wrong url to the search window. Please try process to reset password again.</p>
        <br />
        <p>If you want to go back to the page you input email, please click {"browser's"} back button or click the following button</p>
        <br />
        <Link href="/auth/reset">
          <button className="bg-blue-300"  >
            Restart
          </button>
        </Link>
      </div>
    </div>
  );
}