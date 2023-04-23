"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import Test from "@/components/Test";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Test />
    </main>
  );
}
