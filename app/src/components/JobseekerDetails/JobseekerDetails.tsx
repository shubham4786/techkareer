"use client";
import { jobseekerPlaceHolder, projectPlaceholder } from "@/assets/assets";
import { useFetchSingleJobseekers } from "@/hooks/useJobseekerData";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { DevIcon } from "../components";
import {
  useFetchConnectionStatus,
  useHandleConnection,
} from "@/hooks/useConnectionData";
import { useSession } from "next-auth/react";
import { ConnectionStatus, Project } from "@/types/type";
import { redirect } from "next/navigation";
import Loader from "../ui/Loader";
import { useFetchExperienceByUser } from "@/hooks/useExperienceData";
import { useFetchProjectByUser } from "@/hooks/useProjectData";
import ProjectModal from "../ProjectModal/ProjectModal";

function JobseekerDetails({ username }: { username: string }) {
  const { data: auth, status } = useSession();
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [currProject, setCurrProject] = useState<Project>({} as Project);

  const projectModalClose = () => {
    setCurrProject({} as Project);
    setProjectModalOpen(false);
  };

  useEffect(() => {
    if (
      status != "loading" &&
      auth?.user.role == "Jobseeker" &&
      auth?.user.username == username
    ) {
      redirect("/profile/organization");
    }
  }, [status]);
  const { data: authData } = useSession();
  const { data: jobseeker, isLoading } = useFetchSingleJobseekers(username);
  const { data: connectionData, isLoading: connectionLoading } =
    useFetchConnectionStatus(jobseeker?.id);
  const { mutate: handleConnection, isPending } = useHandleConnection();


  const { data: experiences, isLoading: isExperienceLoading } =
  useFetchExperienceByUser(jobseeker?.id.toString());

  const { data: projects, isLoading: projectLoading } =
    useFetchProjectByUser(jobseeker?.id.toString());


  const handleConnectionRequest = (connectionRequest: ConnectionStatus) => {
    if (jobseeker?.id && connectionData) {
      handleConnection({
        userId: jobseeker.id,
        action:
          connectionRequest == ConnectionStatus.ACCEPTED
            ? "remove"
            : connectionRequest == ConnectionStatus.PENDING
            ? connectionData.followedById == authData?.user.id
              ? "remove"
              : connectionData.followingId == authData?.user.id
              ? "accept"
              : null
            : connectionRequest == ConnectionStatus.FOLLOW
            ? "send"
            : "send",
      });
    }
  };
  return (
    <>
      {isLoading||isExperienceLoading ? (
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
                <div className="header-username  ">@{jobseeker?.username}</div>
              </div>

              {authData?.user.id &&
                authData.user.role == "Jobseeker" &&
                jobseeker && (
                  <div className="follow-username-sec flex items-center justify-center gap-2 mt-2">
                    {connectionLoading || isPending ? (
                      <div className="follow-btn   mt-2">
                        <Loader size="15px"/>
                      </div>
                    ) : (
                      connectionData && (
                        <>
                          <div
                            onClick={() =>
                              handleConnectionRequest(connectionData.status)
                            }
                            className="follow-btn text-[14px]  ps-2 pe-2 border-[1px] rounded border-solid cursor-pointer hover:bg-[#22C55E] hover:text-[white] mt-2"
                          >
                            {/* {rejecting || sending || statusLoading || isFetching */}

                            {connectionData.status == ConnectionStatus.ACCEPTED
                              ? "Connected"
                              : connectionData.status ==
                                ConnectionStatus.PENDING
                              ? connectionData.followedById == authData.user.id
                                ? "Pending"
                                : connectionData.followingId ==
                                    authData.user.id && "Accept"
                              : connectionData.status ==
                                  ConnectionStatus.FOLLOW && "Follow"}
                          </div>
                          {connectionData.followingId == authData.user.id && (
                            <div
                              onClick={() =>
                                handleConnection({
                                  userId: jobseeker.id,
                                  action: "reject",
                                })
                              }
                              className="follow-btn text-[14px]  ps-2 pe-2 border-[1px] rounded border-solid cursor-pointer hover:bg-[#22C55E] hover:text-[white] mt-2"
                            >
                              Reject
                            </div>
                          )}
                        </>
                      )
                    )}
                  </div>
                )}

              <div className="header-username font-medium text-[16px] mt-2">
                {jobseeker.firstName} {jobseeker.lastName}
              </div>
              <div className="header-email text-[13px] mt-3 flex items-center gap-1 justify-center">
                <CiMail />
                {jobseeker?.email}
              </div>
              <div className="header-email text-[13px] color-lgt-grey mt-3 flex items-center gap-1 justify-center">
                Professional Experience{" "}
                {jobseeker?.yearsOfExperience === 0
                  ? ": Fresher"
                  : `of ${jobseeker?.yearsOfExperience} years`}
              </div>
              <div className="job-skills mt-2 flex flex-wrap justify-center items-center w-[70%] mt-5 gap-[9px] text-black">
                {jobseeker?.skills.map((skill, key) => {
                  return (
                    <div
                      key={key}
                      className="skills flex items-center gap-1 text-[14px] font-light pe-2 ps-2  border-[0.1px]  border-solid rounded-[10px]"
                    >
                      <DevIcon skillName={skill}></DevIcon>
                      {skill}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="about-sec pb-3 border-b-[1px] border-b-solid border-b-[#e1e4e8] flex flex-col justify-center mt-2 items-center">
              <div className="header-about text-[14px]">
                About {jobseeker?.firstName} {jobseeker?.lastName}
              </div>
              <div className="header-about-txt text-[13px] text-grey-100 text-justify ps-7 pe-7 pt-4 ">
                {jobseeker?.description}
              </div>
            </div>
            {projectLoading ? (
                <></>
              ) : (
                projects &&
                projects?.length > 0 && (
                  <div className="personal-projects w-full flex flex-col items-center  border-b-[1px] border-b-solid border-b-[#e1e4e8]">
                    <div className="header-experience w-[max-content] text-[14px]">
                      Projects
                    </div>
                    <div className="projetctcards-grid flex mt-4 mb-4 justify-center  flex-wrap w-full px-7 gap-4">
                      {projects?.map((project,key) => (
                        <div
                        key={key}
                          onClick={() => {
                            setCurrProject(project);
                            setProjectModalOpen(true);
                          }}
                          className="project-card cursor-pointer border-[1px] overflow-hidden rounded-[10px] border-solid border-[#e1e4e8] w-[13.4rem] max-sm:w-full max-lg:w-full max-md:w-[13.4rem] h-[14rem] "
                        >
                          <div className="relative project-img h-[74%] border-b-[lgt-grey] border-b-solid border-b-[2px]">
                          {project.image?<img
                              className="object-cover h-full w-full  "
                              src={project.image}
                              alt=""
                            />:<Image
                            className="object-fill h-full w-full  "
                            src={projectPlaceholder}
                            alt=""
                          />}
                          </div>
            
                          <div className="project-overview px-3 py-1 flex flex-col h-[26%]">
                            <div className="project-title font-medium text-[15px]">
                              {project.name}
                            </div>
                            <div className="project-desc truncate text-[13px]">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      ))}
                      {projectModalOpen && jobseeker && (
                        <ProjectModal
                          close={projectModalClose}
                          project={currProject}
                        ></ProjectModal>
                      )}
                    </div>
                  </div>
                )
              )}
              {isExperienceLoading ? (
                <></>
              ) : (
                experiences &&
                experiences.length > 0 && (
                  <div className="experience-section pb-3 border-b-[1px] border-b-solid border-b-[#e1e4e8] flex flex-col w-full items-center">
                    <div className="header-experience w-[max-content] text-[14px]">
                      Experience
                    </div>
                    <div className="experience-list flex flex-col gap-2 w-full mt-1 px-7">
                      {experiences &&
                        experiences.map((experience,key) => (
                        <div key={key} className="card flex flex-col mt-4 ">
                            <div className="role font-medium text-[14px] w-full flex justify-between">
                              <span>{experience.role}</span>{" "}
                              <span>
                                {`${experience.startMonth} ${experience.startYear}` +
                                  "-" +
                                  `${
                                    experience.endMonth || experience.endYear
                                      ? `${experience.endMonth} ${experience.endYear}`
                                      : `Present`
                                  }`}
                              </span>
                            </div>
                            <div className="company-name text-[13px]">
                              {experience.company}{" "}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )} 
          </div>
        )
      )}
    </>
  );
}

export default JobseekerDetails;
