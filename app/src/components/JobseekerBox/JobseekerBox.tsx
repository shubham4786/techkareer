"use client";

import { jobseekerPlaceHolder, organizationPlaceHolder } from "@/assets/assets";
import { JobSeeker, Status } from "@/types/type";
import Image from "next/image";
import React from "react";
import { DevIcon } from "../components";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useHandleSeekerApplication } from "@/hooks/useJobData";
import { useHandleConnection } from "@/hooks/useConnectionData";
import Loader from "../ui/Loader";

function JobseekerBox({
  jobseeker,
  status,
  connectionStatus,
}: {
  jobseeker: JobSeeker;
  status?: Status;
  connectionStatus?: string;
}) {
  const router = useRouter();
  const { data: authData } = useSession();
  const { mutate: handleApplication, isPending } = useHandleSeekerApplication();
  const { mutate: handleConnection, isPending: connectionLoading } =
    useHandleConnection();

  return (
    <>
      <div
        onClick={() => router.push(`/jobseekers/${jobseeker.username}`)}
        className="max-xl:my-[15px] max-xl:w-full w-[45%]  min-h-[max-content] border border-[#E1E4E8] py-[10px] px-[5px] rounded-[10px] cursor-pointer flex flex-col     ps-3 pe-3"
      >
        <div className="people-container flex justify-between items-center">
          <div className="profile-pic  h-[3rem] w-[3rem]  overflow-hidden border-[1px] rounded-full flex justify-center items-center">
            {jobseeker.profilePic == null ? (
              <Image
                className=" object-contain  h-[70%] w-[70%]"
                alt=""
                src={jobseekerPlaceHolder}
              />
            ) : (
              <img
                className="  object-fill h-full w-full "
                src={jobseeker.profilePic}
              ></img>
            )}
          </div>
          <div className="flex items-center gap-[3px]">
            {authData?.user.role === "Jobseeker" && connectionLoading ? (
              <Loader size="15px" />
            ) : connectionStatus ? (
              connectionStatus === "accepted" ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnection({
                      userId: jobseeker.id,
                      action: "remove",
                    });
                  }}
                  className="follow-btn text-[14px] ps-2 pe-2 border-[1px] rounded border-solid border-black"
                >
                  Connected
                </div>
              ) : connectionStatus === "requested" ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnection({
                      userId: jobseeker.id,
                      action: "remove",
                    });
                  }}
                  className="follow-btn text-[14px] ps-2 pe-2 border-[1px] rounded border-solid border-black"
                >
                  Pending
                </div>
              ) : connectionStatus === "requests" ? (
                <>
                  <div className="flex gap-2 items-center ">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnection({
                          userId: jobseeker.id,
                          action: "accept",
                        });
                      }}
                      className="follow-btn text-[14px] ps-2 pe-2 border-[1px] rounded border-solid border-black"
                    >
                      Accept
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnection({
                          userId: jobseeker.id,
                          action: "reject",
                        });
                      }}
                      className="follow-btn text-[14px] ps-2 pe-2 border-[1px] rounded border-solid border-black"
                    >
                      Reject
                    </div>
                  </div>
                </>
              ) : (
                <div className="follow-btn text-[14px] ps-2 pe-2 border-[1px] rounded border-solid border-black">
                  Follow
                </div>
              )
            ) : null}
          </div>
        </div>

        <div className="people-jobseekername text-[14px] mt-1 flex items-center gap-2">
          {`${jobseeker.firstName} ${jobseeker.lastName}`}
          <span className="people-jobseekername  font-medium text-[14px]">
            @{jobseeker.username}
          </span>
        </div>

        <div className="job-skills mt-2 flex gap-1 flex-wrap items-center w-full  text-black">
          {(jobseeker.skills.length < 3
            ? jobseeker.skills
            : jobseeker.skills.slice(0, 3)
          ).map((skill, i) => {
            return (
              <div
                key={i}
                className="skills flex gap-1 items-center text-[12px] font-light pe-2 ps-2  border-[0.1px] truncate  border-solid rounded-[10px]"
              >
                <DevIcon skillName={skill}></DevIcon>
                {skill}
              </div>
            );
          })}

          {jobseeker.skills.length > 3 && (
            <div className="skills text-[11px]  pe-2 ps-2  border-[0.1px]  border-solid rounded-[10px]">
              +{jobseeker.skills.length - 3}
            </div>
          )}
        </div>
        {status && authData?.user.role == "Organization" && (
          <div className="application-status text-[14px] mt-1 flex items-center gap-2">
            <div className="status-job flex text-[13px] items-center   gap-2  mt-1   ">
              <span
                style={{
                  background:
                    status == Status.ACCEPTED
                      ? "green"
                      : status == Status.REJECTED
                      ? "red"
                      : "orange",
                }}
                className="rounded-full h-[5px] w-[5px]"
              ></span>
              {status}
            </div>
            {isPending ? (
              <Loader size="15px"></Loader>
            ) : (
              status == Status.PENDING &&
              jobseeker.jobApplications[0] && (
                <>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplication({
                        applicationData: jobseeker.jobApplications[0],
                        status: "accepted",
                      });
                    }}
                    className="rounded-[5px]  hover:border-[black] flex text-[12px] border-[1px] px-2 py-[3px] flex items-center gap-1"
                  >
                    Accept
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplication({
                        applicationData: jobseeker.jobApplications[0],
                        status: "rejected",
                      });
                    }}
                    className="rounded-[5px]  hover:border-[black] flex text-[12px] border-[1px] px-2 py-[3px] flex items-center gap-1"
                  >
                    Reject
                  </div>
                </>
              )
            )}
          </div>
        )}

        <div className="people-card-desc mt-2 color-lgt-grey w-full text-[12px] pe-2 text-three-line">
          {jobseeker.description}
        </div>
      </div>
    </>
  );
}

export default JobseekerBox;
