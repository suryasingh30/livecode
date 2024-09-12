import Image from 'next/image'
import React from 'react'

export default function Navbar() {
  return (

    <nav className='flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10'>
        <Image
            src="/icons/logo.svg"
            width={32}
            height={32}
            alt='Live Code'
            className='max-sm:size-10'/>

    </nav>

  )
}
