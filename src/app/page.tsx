"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import Test from "@/components/Test";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen p-5 bg-black text-white">
      <Test />
    </main>
  );
}
