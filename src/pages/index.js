import Center from "@/components/Center";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import { getSession } from "next-auth/react";
import Head from "next/head";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>SpotiClone</title>
      </Head>

      {/* <h1 className="text-white">This is a DOPE spotify 2.0 build</h1> */}

      <main className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Center */}
        <Center />
      </main>

      <div className="sticky bottom-0 text-white">
        {/* Player */}
        <Player/>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    }
  }
}
