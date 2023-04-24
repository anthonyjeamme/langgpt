"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const Test = dynamic(() => import("@/components/Test"), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen p-5 bg-black text-white">
      <Test />
    </main>
  );
}
