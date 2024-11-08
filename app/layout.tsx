import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import '@stream-io/video-react-sdk/dist/css/styles.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Interview Nest",
  description: "Web Interview Platform",
  icons: {
    icon: '/icons/logo1.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <ClerkProvider
        appearance={{
          variables: {
            colorText: '#fff',
            colorPrimary: '#0E78F9',
            colorBackground: '#1c1f2e',
            colorInputText: '#fff'
          },
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
      >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-2`}
      >
        {children}
        <Toaster/>
      </body>
      </ClerkProvider>
    </html>
  );
}
