import React from 'react'
import UiButton from '../ui/UiButton'
import { BsLightningCharge } from "react-icons/bs";
import LightGrayButton from '../ui/LightGrayButton';
import { LuDatabase } from "react-icons/lu";

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

                {/* settings button */}
                <LightGrayButton title={'Connect DB'} icon={<LuDatabase />} />
            </div>

        </div>
    )
}

export default QueryInputBox