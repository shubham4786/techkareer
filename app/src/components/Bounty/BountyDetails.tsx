"use client";
import { bountyPlaceholder, organizationPlaceHolder } from "@/assets/assets";
import { Bounty } from "@/types/type";
import { formatTimestampToDDMonthYYYY } from "@/utils/utils";
import Image from "next/image";
import React, { useEffect } from "react";


import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";



function BountyDetails({ bounty }: { bounty: Bounty }) {
    const { data: authData } = useSession();
    const currentDate = new Date();
    const deadline = formatTimestampToDDMonthYYYY(String(bounty.deadline))
    const hasPassed = new Date(deadline) < currentDate;
    return (
        <>
            <div className=" h-full   flex flex-col gap-2 w-full overflow-x-none overflow-y-auto ">
                <div className="bounty-desc-section p-7 flex items-center flex-col w-full ">
                    <div className="intro-sec  flex justify-center w-full items-center ">
                        <div className="img-wrapper flex items-center justify-center h-[4.4rem] w-[4.4rem] border-[2px] rounded-full overflow-hidden relative">
                            <Image
                                alt="bounty-logo"
                                fill
                                src={bountyPlaceholder}
                                className="object-contain rounded-full"
                            />
                        </div>
                    </div>
                    <h1 className="mt-5 text-[18px] font-semibold">{bounty?.role}</h1>
                    <p className=" mt-2 text-[14px] text-gray-400">
                        {bounty?.title}
                    </p>
                    <div className="basic-desc flex mt-4 gap-3 ">
                        <div className="flex gap-2">
                            <h2 className='bg-blue-500 py-2 px-4 rounded-full text-white'>
                                ${bounty?.amount}
                            </h2>
                            <h2 className='bg-blue-500 py-2 px-4 rounded-full text-white'>
                                ${bounty?.gigType}
                            </h2>
                            <Link target="_blank" href={`/bounties/${bounty.id}/submit`} className='flex gap-1 items-center bg-blue-500 py-2 px-4 rounded-full text-white'>
                                <span>Apply Now</span> <ArrowRight size={18} />
                            </Link>
                        </div>

                    </div>
                    <div className=" flex gap-2 text-[14px] mt-4">
                        <h2 className={`py-2 px-4 rounded-full text-white ${hasPassed ? 'bg-red-500' : 'bg-green-500'}`}>
                            <span className="mr-1 font-medium text-white">
                                Deadline
                            </span>
                            {deadline}
                        </h2>
                    </div>
                </div>
                <div className="py-3 px-7  flex flex-col">
                    <div className="mt-2 text-lg text-gray-100 text-justify">
                        {bounty.desc.split('\n').map((paragraph, index) => {
                            if (paragraph.includes('http')) {
                                const parts = paragraph.split(' ');
                                return (
                                    <p key={index}>
                                        {parts.map((part, i) =>
                                            part.startsWith('http') ? (
                                                <a key={i} href={part} className="text-blue-500">{part}</a>
                                            ) : (
                                                <span key={i}>{part} </span>
                                            )
                                        )}
                                    </p>
                                );
                            } else {
                                return <p key={index}>{paragraph}</p>;
                            }
                        })}
                    </div>


                </div>
            </div>
        </>
    );
}

export default BountyDetails;
