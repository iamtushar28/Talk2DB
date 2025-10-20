import React from 'react'
import UiButton from '../ui/UiButton'
import { BsLightningCharge } from "react-icons/bs";
import { LuDatabase } from "react-icons/lu";
import Link from 'next/link';

const QueryInputBox = () => {
    return (
        <div className='w-full md:w-[48%] flex flex-col gap-4'>
            {/* title */}
            <h4 className='font-semibold'>Instruction</h4>

            {/* query input box */}
            <textarea name="userQuery" id="userQuery" cols={70} rows={4} placeholder='Show total sale of this month.' className='p-3 border border-zinc-300 hover:ring-2 hover:ring-violet-500 outline-none rounded-lg transition-all duration-300'></textarea>

            <div className='flex gap-4'>
                {/* generate query button */}
                <UiButton title={'Generate Query'} icon={<BsLightningCharge />} />

                {/* connect db button */}
                <Link
                    href={'/connect'}
                    className='px-4 py-2 text-sm font-semibold text-black bg-white hover:bg-zinc-100 rounded-lg flex gap-2 items-center cursor-pointer transition-all duration-300'
                >
                    Connect DB
                    <LuDatabase />
                </Link>
            </div>

        </div>
    )
}

export default QueryInputBox