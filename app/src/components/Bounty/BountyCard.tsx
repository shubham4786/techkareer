import { Bounty } from '@/types/type'
import { formatTimestampToDDMonthYYYY } from '@/utils/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const BountyCard = ({ bounty }: { bounty: Bounty }) => {
    const router = useRouter();
    const currentDate = new Date();
    const deadline = formatTimestampToDDMonthYYYY(String(bounty.deadline))
    const hasPassed = new Date(deadline) < currentDate;
    return (
        <div
            onClick={() => router.push(`/bounties/${bounty.id}`)}
            className="max-xl:my-[15px] max-xl:w-full w-[45%]  min-h-[max-content] border border-transparent  bg-slate-800/20 py-[10px] px-[5px] rounded-[10px] cursor-pointer flex flex-col justify-between     ps-3 pe-3"
        >
            <div className="flex flex-col h-full gap-2 ps-2">
                <div className="title-sec flex text-[14px] gap-1 items-center w-full ">
                    <h1 className="title text-[24px] font-semibold line-clamp-1">{bounty.title}</h1>
                </div>
                <div className="flex text-[13px]   gap-2 text-[#868788]  ">
                    <p className="text-[14px] line-clamp-3 text-[#868788]">
                        {bounty.desc}
                    </p>
                </div>
                <div className='flex gap-2 items-center'>
                    <span className='text-base px-2 py-[2px] rounded-lg bg-white text-gray-900 cursor-pointer  text-[13px]'>{bounty.gigType}</span>
                    <span className='text-base px-2 py-[2px] rounded-lg bg-white text-gray-900 cursor-pointer  text-[13px]'>{bounty.role}</span>
                </div>
                <div className="about-bounty flex text-[13px] gap-2">
                    <h2 className='bg-blue-500 py-[2px] px-2 rounded-lg text-white'>
                        ${bounty?.amount}
                    </h2>
                    <h2 className={`py-[2px] px-2 rounded-lg text-white ${hasPassed ? 'bg-red-500' : 'bg-green-500'}`}>
                        {deadline}
                    </h2>
                    <Link href={`/bounties/${bounty.id}`} className='bg-blue-500 py-[2px] px-2 rounded-lg text-white'>
                        <ArrowRight size={18} />
                    </Link>
                </div>



            </div>
        </div>
    )
}

export default BountyCard