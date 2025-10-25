import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SelectDBButton = ({ dbImage, title, db }) => {
    return (
        <Link
            href={`/connect/${db}`}
            className="h-20 w-full md:w-[46%] text-xl font-semibold hover:bg-zinc-50 rounded-full border border-zinc-300 flex gap-4 justify-center items-center transition-all duration-300 cursor-pointer">
            {/* db image */}
            <Image
                src={dbImage}
                alt="mysql"
                height={35}
                width={35}
            />
            {title}
        </Link>
    )
}

export default SelectDBButton