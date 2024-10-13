import { ReactNode, useMemo } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const memoizedHeader = useMemo(() => (
    <div className="flex flex-col justify-center p-8 w-full md:w-1/2 space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <Image
          src="/icons/logo1.svg"
          alt="Interview Nest Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-2xl font-semibold text-white">Interview Nest</h1>
      </div>

      <h2 className="text-white text-3xl md:text-5xl font-bold mb-2">
        Experience the Future of Interviews
      </h2>
      <p className="text-cyan-100 text-base md:text-lg lg:text-xl">
        Bridging Distances and Connecting Ambitions with
        <br />
        Live Coding and Video Calls!
      </p>
    </div>
  ), []); 

  return (
    <div className="flex flex-col min-h-screen bg-[#050f1c]">
      <main className="flex-grow flex flex-col md:flex-row h-full pb-8">
        {memoizedHeader}
        
        <div className="flex items-center justify-center p-4 w-full md:w-1/2">
          <div className="relative w-full max-w-md z-10">
            {children}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-14 p-4 md:p-6">
        <Footer />
      </footer>
    </div>
  );
}
