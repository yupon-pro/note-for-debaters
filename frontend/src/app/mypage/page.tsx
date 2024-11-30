import MyPage from "@/features/mypage/components/MyPage";
import { getNoteList } from "@/features/mypage/libs/clientNoteList";

export default async function Page(){
  const noteInfo = await getNoteList();

  return (
    <div className="flex justify-center items-center p-5 h-full w-full" >
      <MyPage  noteInfo={noteInfo} />
    </div>
  );
}