import { jobseekerPlaceHolder, projectPlaceholder } from "@/assets/assets";
import { Experience, Project } from "@/types/type";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { CiMail } from "react-icons/ci";
import { DevIcon } from "../components";
import { TbEdit } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useGetLoggedInUser } from "@/hooks/useJobseekerData";
import Loader from "../ui/Loader";
import {
  useDeleteExperience,
  useFetchExperienceByUser,
} from "@/hooks/useExperienceData";
import { IoAddCircleSharp } from "react-icons/io5";
import ExperienceFormData from "../ExperienceFormData/ExperienceFormData";
import ProjectModal from "../ProjectModal/ProjectModal";
import {
  useDeleteProject,
  useFetchProjectByUser,
} from "@/hooks/useProjectData";
import ProjectFormModal from "../ProjectFormModal/ProjectFormModal";

function JobseekerProfile() {
  const router = useRouter();
  const { mutate: deleteProject, isPending: deleteLoading } =
    useDeleteProject();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const projectFormModalClose = () => {
    setIsProjectFormOpen(false);
  };
  const [isProjectEditFormOpen, setIsProjectEditFormOpen] = useState(false);
  const projectEditFormModalClose = () => {
    setCurrProject({} as Project);
    setIsProjectEditFormOpen(false);
  };

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [currProject, setCurrProject] = useState<Project>({} as Project);
  const projectModalClose = () => {
    setCurrProject({} as Project);
    setProjectModalOpen(false);
  };

  const { data: authData } = useSession();
  const { data: jobseeker, isLoading } = useGetLoggedInUser();
  const { mutate: deleteExperience, isPending: isExperienceDeleteLoading } =
    useDeleteExperience();

  const { data: experiences, isLoading: isExperienceLoading } =
    useFetchExperienceByUser(authData?.user.id.toString());
  const { data: projects, isLoading: projectLoading } = useFetchProjectByUser(
    authData?.user.id.toString()
  );
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const experienceFormModalClose = () => {
    setIsExperienceFormOpen(false);
  };
  const [currExperience, setCurrExperience] = useState<Experience>(
    {} as Experience
  );

  const [isExperienceEditFormOpen, setIsExperienceEditFormOpen] =
    useState(false);
  const experienceEditFormModalClose = () => {
    setCurrExperience({} as Experience);
    setIsExperienceEditFormOpen(false);
  };
  return (
    <>
      {isLoading || isExperienceLoading ? (
        <>
          {" "}
          <div className=" h-full   flex items-center justify-center gap-2 w-full overflow-x-none overflow-y-auto ">
            <Loader size="30px"></Loader>
          </div>
        </>
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
              <div className="header-download text-[14px] mt-3 flex items-center gap-1 justify-center">
                <div
                  onClick={() => {
                    router.push("/profile/jobseeker/edit");
                  }}
                  className="btn-container gap-2 rounded-full border-[1px] border-solid border-[lgt-grey] px-2 py-1 hover:bg-[green] cursor-pointer hover:text-white flex items-center "
                >
                  Edit Profile <TbEdit></TbEdit>
                </div>
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
            {
              // true
              projectLoading || deleteLoading ? (
                <>
                  <div className="personal-projects w-full flex flex-col items-center  border-b-[1px] border-b-solid border-b-[#e1e4e8]">
                    <div className="header-experience w-[max-content] text-[14px]">
                      Projects
                    </div>
                    <div
                      onClick={() => setIsProjectFormOpen(true)}
                      className="header-experience cursor-pointer flex gap-2 items-center mt-3 rounded-[10px] border-solid border-[1px] border-[lgt-grey] px-2 py-1  w-[max-content] text-[14px]"
                    >
                      Add Project <IoAddCircleSharp className="text-[20px]" />
                    </div>
                    <div className="py-5">
                      <Loader size="25px"></Loader>
                    </div>
                  </div>
                </>
              ) : (
                <div className="personal-projects w-full flex flex-col items-center  border-b-[1px] border-b-solid border-b-[#e1e4e8]">
                  <div className="header-experience w-[max-content] text-[14px]">
                    Projects
                  </div>
                  <div
                    onClick={() => setIsProjectFormOpen(true)}
                    className="header-experience cursor-pointer flex gap-2 items-center mt-3 rounded-[10px] border-solid border-[1px] border-[lgt-grey] px-2 py-1  w-[max-content] text-[14px]"
                  >
                    Add Project <IoAddCircleSharp className="text-[20px]" />
                  </div>
                  {isProjectFormOpen && (
                    <ProjectFormModal
                      type="ADD"
                      close={projectFormModalClose}
                    ></ProjectFormModal>
                  )}
                  <div className="projetctcards-grid flex mt-4 mb-4 justify-center  flex-wrap w-full px-6 gap-4">
                    {isLoading ? (
                      <div className="loader-container h-[13rem]">
                        <Loader size="20px"></Loader>
                      </div>
                    ) : (
                      projects &&
                      projects.map((project, key) => (
                        <div
                          key={key}
                          onClick={() => {
                            setCurrProject(project);
                            setProjectModalOpen(true);
                          }}
                          className="project-card cursor-pointer border-[1px] overflow-hidden rounded-[10px] border-solid border-[#e1e4e8] w-[13.4rem] max-sm:w-full  max-md:w-[13.4rem] h-[13rem] "
                        >
                          <div className="relative project-img h-[74%] border-b-[1px] border-b-solid border-b-[lgt-grey]">
                            {project.image ? (
                              <img
                                className="object-cover h-full w-full  "
                                src={project.image}
                                alt=""
                              />
                            ) : (
                              <Image
                                className="object-fill h-full w-full  "
                                src={projectPlaceholder}
                                alt=""
                              />
                            )}
                          </div>

                          <div className="project-overview px-3 py-1 flex flex-col h-[26%]">
                            <div className="flex w-full justify-between items-center mt-1">
                              <div className="project-title font-medium text-[15px]">
                                {project.name}
                              </div>
                              <div className="flex gap-1">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProject(String(project.id));
                                  }}
                                  className="edit-btn text-[14px] border-[1px] border-solid border-[lgt-grey] px-2 hover:bg-[red] hover:text-white rounded-full"
                                >
                                  Delete
                                </div>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrProject(project);
                                    setIsProjectEditFormOpen(true);
                                  }}
                                  className="edit-btn text-[14px] border-[1px] border-solid border-[lgt-grey] px-2 hover:bg-[#22C55E] hover:text-white rounded-full"
                                >
                                  Edit
                                </div>
                              </div>
                            </div>
                            <div className="project-desc truncate text-[13px]">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {isProjectEditFormOpen && (
                      <ProjectFormModal
                        type={"EDIT"}
                        close={projectEditFormModalClose}
                        updateData={{
                          id: String(currProject.id),
                          name: currProject.name,
                          deployedLink: currProject.deployedLink
                            ? currProject.deployedLink
                            : "",
                          repoLink: currProject.repoLink ?? "",
                          description: currProject.description,
                          techStack: currProject.techStack,
                          image: currProject.image ?? null,
                        }}
                      ></ProjectFormModal>
                    )}

                    {projectModalOpen && jobseeker && (
                      <ProjectModal
                        close={projectModalClose}
                        project={currProject}
                      ></ProjectModal>
                    )}
                  </div>
                </div>
              )
            }

            {
            isExperienceLoading ? (
              <>
                <div className="experience-section pb-3 border-b-[1px] border-b-solid border-b-[#e1e4e8] flex flex-col w-full items-center">
                  <div className="header-experience w-[max-content] text-[14px]">
                    Experience
                  </div>
                  <div
                    onClick={() => setIsExperienceFormOpen(true)}
                    className="header-experience  cursor-pointer flex gap-2 items-center mt-3 rounded-[10px] border-solid border-[1px] border-[lgt-grey] px-2 py-1  w-[max-content] text-[14px]"
                  >
                    Add Experience <IoAddCircleSharp className="text-[20px]" />
                  </div>
                  <div className="py-5 flex justify-center w-full">
                    <Loader size="25px"></Loader>
                  </div>
                </div>
              </>
            ) : (
              <div className="experience-section pb-3 border-b-[1px] border-b-solid border-b-[#e1e4e8] flex flex-col w-full items-center">
                <div className="header-experience w-[max-content] text-[14px]">
                  Experience
                </div>
                <div
                  onClick={() => setIsExperienceFormOpen(true)}
                  className="header-experience  cursor-pointer flex gap-2 items-center mt-3 rounded-[10px] border-solid border-[1px] border-[lgt-grey] px-2 py-1  w-[max-content] text-[14px]"
                >
                  Add Experience <IoAddCircleSharp className="text-[20px]" />
                </div>
                <div className="experience-list flex flex-col gap-2 w-full mt-1 px-7">
                  {isExperienceDeleteLoading ? (
                    <>
                      <div className="loader-container h-[5rem] ">
                        <Loader size="20px"></Loader>
                      </div>
                    </>
                  ) : (
                    experiences &&
                    experiences.map((experience, key) => (
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
                        <div className="flex justify-between items-center ">
                          <div className="company-name text-[13px]">
                            {experience.company}
                          </div>
                          <div className="flex gap-2">
                            <div
                              onClick={() => {
                                deleteExperience(String(experience.id));
                              }}
                              className="edit-btn cursor-pointer text-[14px] border-[1px] border-solid border-[lgt-grey] px-2 hover:bg-[red] hover:text-white rounded-full"
                            >
                              Delete
                            </div>
                            <div
                              onClick={() => {
                                setCurrExperience(experience);
                                setIsExperienceEditFormOpen(true);
                              }}
                              className="edit-btn cursor-pointer text-[14px] border-[1px] border-solid border-[lgt-grey] px-2 hover:bg-[#22C55E] hover:text-white rounded-full"
                            >
                              Edit
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isExperienceEditFormOpen && (
                    <ExperienceFormData
                      type="EDIT"
                      close={experienceEditFormModalClose}
                      updateData={{
                        id: String(currExperience.id),
                        role: currExperience.role,
                        company: currExperience.company,
                        startMonth: currExperience.startMonth,
                        startYear: String(currExperience.startYear),
                        endMonth: currExperience.endMonth || "",
                        endYear: currExperience.endYear
                          ? String(currExperience.endYear)
                          : "",
                      }}
                    ></ExperienceFormData>
                  )}
                  {isExperienceFormOpen && (
                    <ExperienceFormData
                      type="ADD"
                      close={experienceFormModalClose}
                    ></ExperienceFormData>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </>
  );
}

export default JobseekerProfile;
