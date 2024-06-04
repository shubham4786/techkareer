"use client";

import jobseekerholder from "@/assets/placholder-jobseeker.webp";
import { Candidate, JobSeeker, Status, User } from "@/types/type";
import Image from "next/image";
import React from "react";
import { DevIcon } from "../components";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useHandleSeekerApplication } from "@/hooks/useJobData";
import { useHandleConnection } from "@/hooks/useConnectionData";

import { getName } from "@/lib/utils";
function JobseekerBox({
  jobseeker,
  status,
  connectionStatus,
}: {
  jobseeker: User;
  status?: Status;
  connectionStatus?: string;
}) {
  const router = useRouter();
  const { data: authData } = useSession();
  const { mutate: handleApplication, isPending } = useHandleSeekerApplication();
  const { mutate: handleConnection, isPending: connectionLoading } = useHandleConnection();

  const mailtoLink = `mailto:${jobseeker.email}`;
  return (
  
      <div
        onClick={() => router.push(`/profile/${jobseeker.id}`)}
        className="max-xl:my-[15px] max-xl:w-full w-[45%]  min-h-[max-content] border border-transparent  bg-slate-800/20 py-[10px] px-[5px] rounded-[10px] cursor-pointer flex flex-col justify-between     ps-3 pe-3"
      >
        <div className="flex flex-col">
          <div className="people-container flex justify-between items-center">
            <div className="flex justify-start items-center gap-2 mb-3 ">
              <div className="profile-pic    overflow-hidden rounded-full flex justify-center items-center">
                {jobseeker.profilePic == null ? (
                  <Image
                    className=" object-contain  "
                    alt=""
                    width={50}
                    height={50}
                    src={jobseekerholder}
                  />
                ) : (
                  <img
                 className=" object-contain  "
                    alt=""
                    width={50}
                    height={50}
                    src={jobseeker.profilePic}
                  ></img>
                )}
              </div>
              <div className="people-jobseekername text-[14px]  flex items-start justify-center  flex-col">
                {jobseeker?.name ? jobseeker.name : getName(jobseeker.email)}
                <span className="people-jobseekername  font-medium text-[14px]">
                  Talent Id: {jobseeker.id}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="job-skills mt-2 flex gap-1 flex-wrap items-center w-full  text-black mb-3">
              {/* {(jobseeker?.roles?.length < 3
                ? jobseeker.roles
                : jobseeker.roles.slice(0, 3)
              ).map((role, i) => {
                return (
                  <div
                    key={i}
                    className="skills flex gap-1 items-center text-[15px] font-light pe-2 ps-2  border-transparent border-[0.1px] truncate  border-solid rounded-[10px] bg-gray-400/20"
                  >
                    <DevIcon skillName={role}></DevIcon>
                    <p className="text-white">{role}</p>
                  </div>
                );
              })} */}

              {/* {jobseeker.roles.length > 3 && (
                <div className="skills text-[11px]  pe-2 ps-2  border-[0.1px]  border-transparent text-white font-semibold  border-solid rounded-[10px] bg-gray-400/20">
                  +{jobseeker.roles.length - 3}
                </div>
              )} */}
            </div>

            <div className="people-card-desc mt-2 color-lgt-grey w-full text-[14px] pe-2 text-three-line">
              {jobseeker.description && jobseeker.description.length > 200
                ? jobseeker.description.slice(0, 200) + "..."
                : jobseeker.description}
          </div>
        </div>

        <div>
          <button
            className="bg-white text-black rounded-full px-5 mt-6 text-xs py-2 font-semibold  border-[1px] bg-transparent hover:border-white hover:text-white hover:bg-transparent transition-all duration-300 ease-in-out"
            onClick={() => window.open(mailtoLink, "_blank")}
          >
            Contact
          </button>
        </div>
        </div>
        </div>
  );
}

export default JobseekerBox
