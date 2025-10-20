import React from 'react'
import LightGrayButton from '../ui/LightGrayButton'
import { IoPlayOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";

const GeneratedResponse = () => {
    return (
        <div className='w-full md:w-[48%] flex flex-col gap-4'>

            {/* actions */}
            <div className='w-full flex justify-end'>
                {/* run query */}
                <LightGrayButton title={'Run Query'} icon={<IoPlayOutline />} />
                
                {/* edit query */}
                <LightGrayButton title={'Edit'} icon={<BiEditAlt  />} />
            </div>

            {/* response box */}
            <div className='w-full p-4 bg-gray-50 rounded-lg'>
                <p className='text-zinc-500'>Generated query appears here...</p>
            </div>

        </div >
    )
}

export default GeneratedResponse