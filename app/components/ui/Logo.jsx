import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <Link href="/" className="flex gap-1 items-center">
            <Image src={'/images/logo.png'} alt="talk2db logo" height={35} width={35} />
            <p className="text-2xl font-semibold text-zinc-900">
                Talk2DB
            </p>
        </Link>
    )
}

export default Logo