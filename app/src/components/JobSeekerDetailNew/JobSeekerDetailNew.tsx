"use client";
import { jobseekerPlaceHolder, projectPlaceholder } from "@/assets/assets";
import { useFetchSingleJobseekers } from "@/hooks/useJobseekerData";
import Image from "next/image";
import React, { useEffect } from "react";
import { CiMail } from "react-icons/ci";
import { DevIcon } from "../components";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loader from "../ui/Loader";


function JobseekerDetails({ id }: { id: string }) {
  const { data: auth, status } = useSession();


  useEffect(() => {
    if (
      status != "loading" &&
      auth?.user.role == "Jobseeker" 
      // auth?.user.username == username
    ) {
      redirect("/profile/organization");
    }
  }, [status]);
  const { data: authData } = useSession();
  const { data: jobseeker, isLoading } = useFetchSingleJobseekers(id);




  return (
    <>
      {isLoading ? (
        <div className=" h-full w-full  flex justify-center items-center">
          <Loader size="30px"></Loader>
        </div>
      ) : (
        jobseeker && (
          <div className=" h-full   flex flex-col gap-2 w-full overflow-x-none overflow-y-auto ">
            <div className="intro-sec border-b-[1px] border-b-solid border-b-[#e1e4e8] flex flex-col  w-full justify-center mt-5 items-center pb-3">
              <div className="image-container flex justify-center items-center h-[5rem] w-[5rem] border-[2px] border-solid border-[#22C55E] p-[1px]">
                {jobseeker.profilePic ? (
                  <img
                    src={`${jobseeker?.profilePic}`}
                    className="h-full w-full  object-cover "
                  />
                ) : (
                  <Image
                    alt=""
                    src={jobseekerPlaceHolder}
                    className="h-full w-full  object-contain  p-4"
                  />
                )}
              </div>
              <div className="follow-username-sec flex items-center justify-center gap-2 mt-2">
                <div className="header-username  ">@{jobseeker.email}</div>
              </div>



              <div className="header-username font-medium text-[16px] mt-2">
                {jobseeker?.name}
              </div>
              <div className="header-email text-[13px] mt-3 flex items-center gap-1 justify-center">
                <CiMail />
                {jobseeker?.email}
              </div>
              <div className="job-skills mt-2 flex flex-wrap justify-center items-center w-[70%] mt-5 gap-[9px] text-black">
                {jobseeker?.roles.map((role, key) => {
                  return (
                    <div
                      key={key}
                      className="skills flex items-center gap-1 text-[14px] font-light pe-2 ps-2  border-[0.1px]  border-solid rounded-[10px]"
                    >
                      <DevIcon skillName={role}></DevIcon>
                      <p className="text-white">{role}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="about-sec pb-3 border-b-[1px] border-b-solid border-b-[#e1e4e8] flex flex-col justify-center mt-2 items-center">
              <div className="header-about text-[14px]">
                About {jobseeker?.name}
              </div>
              <div className="header-about-txt text-[13px] text-grey-100 text-justify ps-7 pe-7 pt-4 ">
                {jobseeker?.introduction}
              </div>
            </div>
         
          </div>
        )
      )}
    </>
  );
}

export default JobseekerDetails;
