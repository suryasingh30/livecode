import React, { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Interview Nest",
  description: "Web Interview Platform",
  icons: {
    icon: '/icons/logo1.svg'
  }
};

function HomeLayout({children} : {children: ReactNode}) {
  return (
    <main className='flex flex-col min-h-screen relative'>
    <Navbar />

    <div className='flex flex-1'>
      <Sidebar />

      <section className='flex flex-col px-6 pb-6 pt-28 max-wid:pd-14 sm:px-14 flex-1'>
        <div className='w-full'>{children}</div>
      </section>
    </div>

    <Footer />
  </main>
  )
}

export default HomeLayout