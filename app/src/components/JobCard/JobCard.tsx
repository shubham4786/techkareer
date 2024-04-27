"use client";
import { organizationPlaceHolder } from "@/assets/assets";
import { JobProfile, Status } from "@/types/type";
import { formatTimestampToDDMonthYYYY } from "@/utils/utils";
import Image from "next/image";
import React from "react";
import { DevIcon } from "../components";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RiContactsLine } from "react-icons/ri";

function JobCard({ job, status }: { job: JobProfile; status?: Status }) {
  const router = useRouter();
  const {data:authData}=useSession()
  return (
    <>
      <div
        onClick={() =>
          router.push(
            `/jobs/${job.organization.username
              .replace(/\s/g, "")
              .toLowerCase()}-${job.id}-${job.role
              .replace(/\s/g, "")
              .toLowerCase()}`
          )
        }
        className="card-container w-full  h-[max-content]   mt-2 flex flex-nowrap pt-2 pb-2 ps-1 pe-1  cursor-pointer border-b-[1px] border-b-solid border-b-[lgt-grey]  "
      >
        <div className="org-logo  h-full flex justify-center mt-2 ms-1 ">
          <div className="logo-container relative h-[4rem] w-[4rem] overflow-hidden ">
            {job.organization.profilePic ? (
              <img
                src={job.organization.profilePic}
                className="h-full w-full rounded-full absolute"
                alt=""
              />
            ) : (
              <Image
                src={organizationPlaceHolder}
                fill
                className="h-full w-full rounded-full "
                alt=""
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
              {`at ${job.organization.name}, ${job.location}`}
            </div>
          </div>
          <div className="about-job flex text-[13px]   gap-2 text-[#868788]  ">
            {job.employeeType} • ₹{job.salary}Lpa • {job.requiredExperience}Y
            experience • posted{" "}
            {formatTimestampToDDMonthYYYY(String(job.createdAt))}
          </div>
          {(status &&authData?.user.role=='Jobseeker') && (
            <div className="status-job flex text-[13px] items-center   gap-2  mt-1   ">
              <span style={{background:status==Status.ACCEPTED?"green":status==Status.REJECTED?"red":"orange"}} className="rounded-full h-[5px] w-[5px]"></span>{status}
            </div>
          )}
          <div className="job-skills mt-2 flex flex-wrap items-center w-full gap-[9px] text-black">
            {(job.skillsRequired.length < 3
              ? job.skillsRequired
              : job.skillsRequired.slice(0, 3)
            ).map((skill, i) => {
              return (
                <div
                  key={i}
                  className="skills truncate flex  gap-1 items-center text-[12px] font-light pe-2 ps-2  border-[0.1px]  border-solid rounded-[10px]"
                >
                  <DevIcon skillName={skill}></DevIcon>
                  {skill}
                </div>
              );
            })}

            {job.skillsRequired.length > 3 && (
              <div className="skills text-[13px]  pe-2 ps-2  border-[0.1px]  border-solid rounded-[10px]">
                +{job.skillsRequired.length - 3}
              </div>
            )}
          </div>
          {(authData?.user.role=='Organization' &&job.organizationId.toString()==(authData.user.id).toString()) && (
            <div className="applicant-btn flex text-[12px] items-center   gap-2  mt-2   ">
              <div onClick={(e)=>{
                
                e.stopPropagation();
                router.push( `/jobs/applicants/${job.id}`) }} className="rounded-[5px]  hover:border-[black] flex text-[12px] border-[1px] px-2 py-[3px] flex items-center gap-1">View Applicants<RiContactsLine /></div>
            </div>
          )}          
        </div>
      </div>
    </>
  );
}

export default JobCard;
