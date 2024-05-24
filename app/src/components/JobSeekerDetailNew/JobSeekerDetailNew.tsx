"use client"
import jobseekerPlaceholder from "@/assets/placholder-jobseeker.webp";
import { useFetchSingleJobseekers } from "@/hooks/useJobseekerData";
import Image from "next/image";
import React, { useEffect } from "react";
import { DevIcon } from "../components";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { MoveUpRight, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { User } from "@/types/type";
import { Loader } from "lucide-react";
import { Candidate } from "@/types/type";

type jobseekerProp = {
  jobseeker: Candidate
  isLoading: boolean
}
function JobseekerDetails({ jobseeker , isLoading }: jobseekerProp) {
  const { data: auth, status } = useSession();

  useEffect(() => {
    if (
      status != "loading" &&
      auth?.user.role == "Jobseeker"
    ) {
      redirect("/profile/organization");
    }
  }, [status]);
  const { data: authData } = useSession();


  console.log(jobseeker);

  return (
    <>
      {isLoading ? (
        <div className=" h-full w-full  flex justify-center items-center">
          <Loader className="text-white"></Loader>
        </div>
      ) : (
        jobseeker && (
          <div className=" h-full   flex flex-col gap-2 w-full overflow-x-none overflow-y-auto ">
            <div className="intro-sec  pb-6 flex flex-col  w-full justify-center mt-5 items-center ">
              <div className="image-container flex justify-center items-center ">
                {jobseeker.profilePic ? (
                  <Image
                    src={`${jobseeker?.profilePic}`}
                    alt=""
                    width={50}
                    height={50}
                  />
                ) : (
                  <Image
                    src={jobseekerPlaceholder}
                    alt=""
                    width={50}
                    height={50}
                  />
                )}
              </div>

              <div className="flex flex-col justify-center items-center text-[16px] mt-2">
                <p>{jobseeker?.name}</p>
                <p>@{jobseeker.email}</p>
              </div>
              <div
                className="header-email  itemtext-lg px-4 py-2 rounded-full bg-white text-gray-900 cursor-pointer  text-[13px] mt-3 flex items-center gap-1 justify-center   decoration-underline"
                onClick={() => {}}
              >
                <p className="text-gray-900">Contact</p>

                <MoveUpRight size={12} className="text-gray-900" />
              </div>
              <div className="job-skills  flex flex-wrap justify-center items-center w-[70%] mt-5 gap-[9px] text-black">
                {jobseeker?.github && (
                  <div
                    className="  text-base px-4 py-2 rounded-full bg-white text-gray-900 cursor-pointer  text-[13px] flex items-center gap-1 justify-center   "
                    onClick={() => {
                      window.lo;
                    }}
                  >
                    <Link
                      href={jobseeker.github}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="flex gap-2 justify-center items-center"
                    >
                      <Github size={15} className="text-gray-900" />
                      <p className="text-gray-900">Github</p>
                    </Link>
                  </div>
                )}
                {jobseeker?.linkedin && (
                  <div
                    className="header-email  text-base px-4 py-2 rounded-full bg-white text-gray-900 cursor-pointer flex items-center gap-1 justify-center   "
                    onClick={() => {}}
                  >
                    <Link
                      href={jobseeker.linkedin}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="flex gap-2 justify-center items-center"
                    >
                      <Linkedin size={15} className="text-gray-900" />
                      <p className="text-gray-900">LinkedIn</p>
                    </Link>
                  </div>
                )}
              </div>
              <div className="job-skills  flex flex-wrap justify-center items-center w-[70%] mt-5 gap-[9px] text-black">
                {jobseeker?.roles.map((role, key) => {
                  return (
                    <div
                      key={key}
                      className="skills flex items-center gap-1 text-[14px] bg-gray-200 font-light pe-2 ps-2  border-[0.1px]  border-solid rounded-[10px]"
                    >
                      <DevIcon skillName={role}></DevIcon>
                      <p className="text-gray-800">{role}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="about-sec pb-3  flex flex-col justify-start mt-2 items-start gap-4 px-2">
              <p className="header-about  text-white  text-4xl  font-semibold">
                About
              </p>
              <div className="header-about-txt text-xl text-grey-100 text-justify  ">
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
