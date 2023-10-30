import Image from 'next/image'
import { Inter, Barlow } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import Nav from '@/components/Nav';
import Layout from '@/components/Layout';

export default function Home() {
  const { data: session } = useSession();
 return (
   <Layout>
     <div className="text-blue-700 flex justify-between">
       <h2>
         Hello, <b>{session?.user?.name}</b>
       </h2>
       <div className="flex bg-white border items-center gap-1 text-black rounded-lg overflow-hidden">
         <Image src={session?.user?.image} width={40} height={40} alt="profile avatar"  />
         <span className="px-2">{session?.user?.name}</span>
       </div>
     </div>
   </Layout>
 );
}
