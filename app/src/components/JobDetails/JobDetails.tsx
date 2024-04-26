"use client";
import { organizationPlaceHolder } from "@/assets/assets";
import { JobProfile } from "@/types/type";
import { formatTimestampToDDMonthYYYY } from "@/utils/utils";
import Image from "next/image";
import React, { useEffect } from "react";
import { DevIcon } from "../components";
import { useApplyJob, useFetchStatusOfApplication } from "@/hooks/useJobData";
import { useSession } from "next-auth/react";
import { MdDone, MdOutlineTransitEnterexit } from "react-icons/md";
import Loader from "../ui/Loader";

function JobDetails({ job }: { job: JobProfile }) {
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
        <div className="job-desc-section border-b-[1px] p-7 flex flex-col w-full ">
          <div className="intro-sec  flex justify-between w-full items-center ">
            <div className="img-wrapper flex items-center justify-center h-[4.4rem] w-[4.4rem] border-[2px] rounded-full overflow-hidden relative">
              {!job.organization.profilePic ? (
                <Image
                  alt=""
                  fill
                  src={organizationPlaceHolder}
                  className=" object-contain"
                />
              ) : (
                <img
                  src={job.organization.profilePic}
                  className="absolute rounded-full h-full w-full object-fill"
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
          <div className="role-name mt-5 text-[18px]">{job?.role}</div>
          <div className="role-name mt-2 text-[14px] color-lgt-grey">
            At {job?.organization.name},{job?.location} • {job?.employeeType}
          </div>

          <div className="basic-desc flex mt-4 gap-3 ">
            <div className="flex flex-col">
              <div className="experience-sec">
                <div className="primary-text color-lgt-grey ">Experience</div>
                <div className="text-[14px]">
                  {job.requiredExperience == 0
                    ? "Fresher"
                    : `${job?.requiredExperience} years`}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="experience-sec">
                <div className="primary-text text-[14px] color-lgt-grey">
                  Salary
                </div>
                <div className="text-[14px]">{job?.salary} lpa</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="experience-sec">
                <div className="primary-text color-lgt-grey">Type</div>
                <div className="text-[14px]">{job?.employeeType}</div>
              </div>
            </div>
          </div>
          <div className="time-posted text-[14px] color-lgt-grey mt-4">
            Posted on{" "}
            <span className="text-black">
              {formatTimestampToDDMonthYYYY(job?.createdAt.toString())}
            </span>
          </div>
        </div>
        <div className="skills-section  border-b-[1px] py-3 px-7 flex flex-col w-full ">
          <div className="intro-sec  flex flex-col justify-between w-full  ">
            <div className="Skill-list text-[14px]">Skills</div>
            <div className="job-skills mt-2 flex flex-wrap items-center w-full gap-[9px] text-black">
              {job?.skillsRequired.map((skill, key) => {
                return (
                  <div
                    key={key}
                    className="skills cursor-default flex items-center gap-1 pt-1 pb-1 text-[14px] font-light pe-2 ps-2  border-[0.1px]  border-solid rounded-[10px]"
                  >
                    <DevIcon skillName={skill}></DevIcon>
                    {skill}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="description-section  border-b-[1px] py-3 px-7  flex flex-col">
          <div className="desc-header text-[14px]">About this Opportunity</div>
          <div className="desc-text pt-4 text text-[13px] text-justify">
            {job.jobDescription}
          </div>
        </div>
      </div>
    </>
  );
}

export default JobDetails;
