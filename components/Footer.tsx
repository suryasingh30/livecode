"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='w-full bg-[#0e2645] p-6 text-white'>
      <div className='flex justify-around'>
        <Link href='/created-by' className='text-white font-bold hover:underline'>
          Created By
        </Link>
        <Link href='/privacy-policy' className='text-white font-bold hover:underline'>
          Privacy and Policy
        </Link>
        <Link href='/terms-of-service' className='text-white font-bold hover:underline'>
          Terms of Service
        </Link>
        <Link href='/about' className='text-white font-bold hover:underline'>
          About
        </Link>
      </div>
    </footer>
  );
}
