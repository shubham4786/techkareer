"use client";
import { organizationPlaceHolder } from "@/assets/assets";
import { JobProfile, Opportunity } from "@/types/type";
import { formatTimestampToDDMonthYYYY } from "@/utils/utils";
import Image from "next/image";
import React, { useEffect } from "react";
import { DevIcon } from "../components";
import { useApplyJob, useFetchStatusOfApplication } from "@/hooks/useJobData";
import { useSession } from "next-auth/react";
import { MdDone, MdOutlineTransitEnterexit } from "react-icons/md";
import Loader from "../ui/Loader";


function JobDetails({ job }: { job: Opportunity }) {
  const { data: authData } = useSession();
  const { data: application, isLoading: statusLoading } =
    useFetchStatusOfApplication(job.id);
  const { mutate: applyJob, isPending } = useApplyJob(job.id);
  const handleStatus = () => {
    if (authData) {
      applyJob();
    }
  };

  return (
    <>
      <div className=" h-full   flex flex-col gap-2 w-full overflow-x-none overflow-y-auto ">
        <div className="job-desc-section border-b-[1px] border-gray-600 p-7 flex flex-col w-full ">
          <div className="intro-sec  flex justify-between w-full items-center mb-8 ">
            <div className="img-wrapper flex items-center justify-center h-[4.4rem] w-[4.4rem] border-[2px] rounded-full overflow-hidden relative">
              {!job.companyLogo ? (
                <Image
                  alt=""
                  fill
                  src={organizationPlaceHolder}
                  className=" object-contain"
                />
              ) : (
                <Image
                  src={job.companyLogo}
                  className="absolute rounded-full h-full w-full object-fill"
                  width={50}
                  alt=""
                  height={50}
                />
              )}
            </div>
            <div>
              {authData &&
                authData.user.role == "Jobseeker" &&
                (statusLoading || isPending ? (
                  <Loader size="25px"></Loader>
                ) : (application ? (
                  <>
                    <div className="follow-btn flex gap-2 items-center  bg-white text-[14px] cursor-pointer hover:bg-[#22C35E] hover:text-[white] ps-2 pe-2 border-[1px] rounded border-solid border-black">
                      {application.status.toString().charAt(0) +
                        String(application.status).toLowerCase().slice(1)}{" "}
                      <MdDone className="text-[18px]" />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        handleStatus();
                      }}
                      className="follow-btn flex gap-2 items-center  bg-white text-[14px] cursor-pointer hover:bg-[#22C35E] hover:text-[white] ps-2 pe-2 border-[1px] rounded border-solid border-black"
                    >
                      Apply <MdOutlineTransitEnterexit className="text-[18px]" />
                    </div>
                  </>
                )))}
            </div>
          </div>
          <div>
            <div className="flex justify-start items-center gap-2">
              <p className="text-xl ">{job?.companyName} -</p>
              <p className="role-name text-base bg-gray-600 px-4 py-1 w-fit rounded-full">{job?.role} ({job?.commitment})</p>
            </div>
            </div>
          {/* <div>{job?.companyName}</div>
          <div className="role-name mt-5 text-[18px] bg-gray-600 px-5 py-1 w-fit rounded-full">{job?.role}</div>
          <div className="role-name mt-2 text-[14px] color-lgt-grey">
            At {job?.companyName},{job?.location} • {job?.commitment}
          </div> */}

          <div className="basic-desc flex mt-4 gap-3 flex-col ">
            {
              job?.yearsExp &&  <div className="flex flex-col">
         <div className="flex justify-start items-center gap-3">
                <div className="primary-text text-lg color-lgt-grey">Experience -</div>
                <div className="text-lg px-3 py-1 bg-gray-600 rounded-full">
     
                  {job?.yearsExp === "0"
                    ? "Fresher"
                    : `${job?.yearsExp} years`}
                </div>
              </div>
            </div>
            }
            {
              job?.payRange &&             <div className="flex flex-col">
              <div className="flex justify-start items-center gap-3">
                <div className="primary-text text-lg color-lgt-grey">
                  Salary -
                </div>
                <div className="text-lg px-3 py-1 bg-gray-600 rounded-full">{job?.payRange} lpa</div>
              </div>
            </div>
            }
           
           {
            job?.location        &&     <div className="flex flex-col">
            <div className="flex justify-start items-center gap-3">
                <div className="primary-text text-lg color-lgt-grey">Location -</div>
              <div className="text-lg bg-gray-600 rounded-full px-3 py-1" >{job?.location}</div>
            </div>
          </div>
           }


          </div>
          <div className="time-posted text-base text-gray-500 mt-4">
            Posted at
            <span className="text-gray-500  text-base ml-1">
              {formatTimestampToDDMonthYYYY(String(job.createdAt))}
            </span>
          </div>
        </div>
        <div className="   py-3 px-7  flex flex-col">
          <div className="text-2xl">About </div>
          <div className="desc-text pt-4 text text-xl text-justify">
            {job.companyDesc}
          </div>
        </div>
      </div>
    </>
  );
}

export default JobDetails;
