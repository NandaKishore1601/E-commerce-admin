import Layout from "@/components/layout";
import { useSession } from "next-auth/react";

export default function Home(){
  const {data : session} = useSession();
  
return(
  <Layout>
   <div className="text-blue-900 flex  justify-between ">
         <h2> hello,<b>{session?.user?.name}</b>
         </h2>
    <div className="flex bg-gray-500 text-green-200 gap-1 rounded-lg">
    <img src={session?.user?.image} alt="" className="w-8 h-8 rounded-lg"></img>
    <span className="py-1 px-2">{session?.user?.name}</span>
    </div>
   </div>
  </Layout>
  
)
}