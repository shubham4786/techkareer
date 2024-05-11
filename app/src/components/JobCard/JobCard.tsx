"use client";
import { organizationPlaceHolder } from "@/assets/assets";
import { JobProfile, Opportunity, Status } from "@/types/type";
import { formatTimestampToDDMonthYYYY } from "@/utils/utils";

import React from "react";
import { DevIcon } from "../components";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RiContactsLine } from "react-icons/ri";
import Image from "next/image";
function JobCard({ job, status }: { job: Opportunity; status?: Status }) {
  const router = useRouter();
  const { data: authData } = useSession()
  return (
    <>
      <div
        onClick={() =>
          router.push(
            `/jobs/${job.id
            }`
          )
        }
        className="max-xl:my-[15px] max-xl:w-full w-[45%]  min-h-[max-content] border border-transparent  bg-slate-800/20 py-[10px] px-[5px] rounded-[10px] cursor-pointer flex flex-col justify-between  ps-3 pe-3"
      >
        <div className="org-logo  h-full flex justify-center mt-2 ms-1 ">
          <div className="logo-container relative h-[4rem] w-[4rem] overflow-hidden ">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                className="h-full w-full rounded-full absolute"
                alt=""
                width={50}
                height={50}
              />
            ) : (
              <Image
                src={organizationPlaceHolder}
     
                className="h-full w-full rounded-full "
                alt=""
                width={50}
                height={50}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col h-full gap-[3px] ps-2">
          <div className="title-sec flex text-[14px] gap-1 items-center w-full ">
            <div className="title text-[16px] font-900">{job.role}</div>
          </div>
          <div className="job-location flex text-[13px]   gap-2 text-[#868788]  ">
            <div className="org-name w-full text-[14px] text-[#868788] word-wrap-overflow w-24 flex">
              {`at ${job.title}, ${job.location}`}
            </div>
          </div>
          <div className="about-job flex text-[13px]   gap-2 text-[#868788]  ">
            ₹{job?.payRange}Lpa
            experience • posted{" "}
            {formatTimestampToDDMonthYYYY(String(job.createdAt))}
          </div>
          {(status && authData?.user.role == 'Jobseeker') && (
            <div className="status-job flex text-[13px] items-center   gap-2  mt-1   ">
              <span style={{ background: status == Status.ACCEPTED ? "green" : status == Status.REJECTED ? "red" : "orange" }} className="rounded-full h-[5px] w-[5px]"></span>{status}
            </div>
          )}


        </div>
      </div>
    </>
  );
}

export default JobCard;
