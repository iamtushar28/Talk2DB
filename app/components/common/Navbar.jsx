import React from 'react'
import UiButton from '../ui/UiButton'
import { IoMdArrowForward } from "react-icons/io";
import { IoRocket } from "react-icons/io5";

const Navbar = () => {
  return (
    <nav className='h-16 px-4 w-full border-b border-zinc-200/60 flex justify-between items-center'>

      {/* logo */}
      <h2 className='text-2xl font-semibold text-zinc-900'>Talk2DB</h2>

      <div className='flex gap-4 items-center'>
        {/* sign in button */}
        <UiButton title={'Sign In'} icon={<IoMdArrowForward />} />

        {/* go pro button */}
        {/* <UiButton title={'Go Pro'} icon={<IoRocket />} /> */}

        {/* user profile icon */}
        <div className='h-10 w-10 bg-zinc-200 rounded-full'></div>

      </div>

    </nav>
  )
}

export default Navbar