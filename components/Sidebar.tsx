import React from 'react'
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  return (
    <aside className='sidebar'>
        <Link href="/">
        <Image src="/assets/icons/logo-full-brand.svg" alt='logo' width={150} height={150} className='hidden h-auto lg:block'></Image>
        <Image src="/assets/icons/logo-brand.svg" alt='logo' width={52} height={52} className='lg:hidden'></Image>
        
        </Link>
        <nav className='sidebar-nav'>
            <ul className='flex flex-1 flex-col gap-6'>


            </ul>
        </nav>


    </aside>
  )
}

export default Sidebar