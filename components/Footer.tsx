"use client";

import Link from 'next/link';
import React from 'react';

const footerLinks = [
  { href: '/created-by', label: 'Created By' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms' },
  { href: '/about', label: 'About' },
];

export default function Footer() {
  return (
    <footer className='w-full bg-[rgba(14, 38, 69, 0.8)] p-3 text-white fixed bottom-0'>
      <div className='flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4'>
        <span className='text-center text-sm'>Copyright © 2024 Interview Nest</span>
        {footerLinks.map((link, index) => (
          <React.Fragment key={link.href}>
            {index > 0 && <span className='hidden sm:inline text-sm'>|</span>}
            <Link href={link.href} className='text-white hover:underline text-center text-sm'>
              {link.label}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </footer>
  );
}
