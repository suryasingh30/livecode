import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Interview Nest",
  description: "Web Interview Platform",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({children} : {children: ReactNode}) {
  return (
    <div>
        <main>
          <StreamVideoProvider>   
            {children}
          </StreamVideoProvider>
        </main>
    </div>
  )
}
