"use client";
import React, { useEffect, useState } from "react";
import { jobseekerPlaceHolder } from "@/assets/assets";
import { useFetchAllJobseekers } from "@/hooks/useJobseekerData";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { JobSeeker, User } from "@/types/type";
import { useSession } from "next-auth/react";
import { shuffle } from "@/utils/utils";
import { getName } from "@/lib/utils";

function RightBarJobseekerList() {
  const router = useRouter();
  const { data: authData } = useSession();
  const [seekers, setSeekers] = useState<User[]>([]);

  const { data: jobseekers, isSuccess } = useFetchAllJobseekers(
    "seekers-for-section"
  );
  useEffect(() => {
    if (jobseekers && jobseekers.length > 0) {
      setSeekers(() => shuffle([...jobseekers]));
    }
  }, [jobseekers]);
  return (
    <>
      <div className="people-rec-section  w-full flex flex-col mt-6 ">
        <div
          onClick={() => router.push("/jobseekers")}
          className="text-holder cursor-pointer flex justify-between items-center text-[14px] font-medium ms-3 me-3"
        >
          People on Techkareer
          <FaArrowRightLong />
        </div>
        <div className="user-desc flex flex-col gap-[2px] w-full ps-2 pe-2 mt-1 ps-3">
          {seekers ? (
            seekers
              .slice(0, 3)

              .map((jobseeker: User) => {
                return (
                  <div
                    onClick={() => router.push(`/jobseekers/${jobseeker.id}`)}
                    key={jobseeker.id}
                  >
                    <div className="profile-pic-follow cursor-pointer mt-1 flex flex-between items-center">
                      <div className="profile-pic h-[2.3rem] w-[2.3rem] flex flex-between justify-center items-center  mt-2 overflow-hidden border-[1px] rounded-full">
                        {jobseeker.profilePic ? (
                          <img
                            className=" object-fill  h-full w-full"
                            alt=""
                            src={`${jobseeker.profilePic}`}
                          ></img>
                        ) : (
                          <Image
                            src={jobseekerPlaceHolder}
                            alt=""
                            className=" object-contain  h-full w-full"
                          ></Image>
                        )}
                      </div>
                      <div className="people-username text-[13px] mt-2 ms-2">
                        {jobseeker?.name
                          ? jobseeker.name
                          : getName(jobseeker.email)}
                      </div>
                    </div>
                    <div className="people-desc truncate color-lgt-grey w-full text-[13px] mt-2 pe-2 mb-1">
                      {jobseeker.introduction}
                    </div>
                  </div>
                );
              })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default RightBarJobseekerList;
