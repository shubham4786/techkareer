import { IoArrowUpOutline, IoCloseCircle } from "react-icons/io5";
import DevIcon from "../Devicon/Devicon";
import { useEffect, useRef } from "react";
import { Project } from "@/types/type";
import { projectPlaceholder } from "@/assets/assets";
import Image from "next/image";

function ProjectModal({project,close}: {project:Project ,close: () => void}) 
{
  const modalContainer=useRef<HTMLDivElement>(null)
  const handleOutsideClick = (e: MouseEvent) => {
    if (modalContainer.current && !modalContainer .current.contains(e.target as Node)) {
      close();
    }
  };
  useEffect(() => {
    console.log(project)
    document.addEventListener("mousedown", handleOutsideClick);
  }, []);
  return (
    <>
      <div className="overlay absolute top-0 left-0 z-50 w-[100vw] h-[100vh] bg-gray-400 opacity-30  flex items-center justify-center  "></div>
      <div className="overlay  absolute top-0 left-0 z-50 w-[100vw] h-[100vh]   flex items-center  justify-center  ">
        <div ref={modalContainer} className="project-container rounded-[10px] overflow-hidden relative opactiy-100  top-0 bg-white w-[45rem] max-md:w-full h-[35rem] mx-[1rem]">
          <div className="relative project-image-container h-[60%] border-b-[1px] border-b-solid border-b-[lgt-grey]">
           { !project.image?
           <Image
           src={projectPlaceholder}
           className="h-full w-full object-cover"
           alt=""
         />
           :<img
              src={project.image}
              className="h-full w-full object-cover"
              alt=""
            />}
          </div>
          <div className="project-image-overlay absolute bg-[#00000033]  opactiy-0  top-0  w-full h-[60%]   ">
            <div className="close-btn w-full flex justify-end pt-4 pe-4">
              <IoCloseCircle
                onClick={() => close()}
                className="cursor-pointer text-[30px] text-white"
              />
            </div>
          </div>
          <div className="project-desc   h-[40%] overflow-y-auto w-full py-3 flex-col px-5 ">
            <div className="project-name mt-3 font-semibold text-[17px] flex items-center gap-2">
              {project.name}{" "}
              {project.deployedLink&&<a
                href={`${project.deployedLink}`}
                className="cursor-pointer font-[500] text-[13px] rounded-full border-[1px] border-solid border-[#e1e4e8] px-2 flex gap-1 items-center "
              >
                Demo <IoArrowUpOutline className="rotate-45" />
              </a>}
              {project.repoLink&&<a
                href={`${project.repoLink}`}
                className="cursor-pointer font-[500] text-[13px] rounded-full border-[1px] border-solid border-[#e1e4e8] px-2 flex gap-1 items-center "
              >
                Repo <IoArrowUpOutline className="rotate-45" />
              </a>}
            </div>
            <div className="tech-skills w-full flex flex-wrap  mt-4 gap-1">
              {project.techStack.map((skill,index) => {
                return (
                  <div key={index} className="skills truncate flex min-w-[max-content] items-center gap-1 text-[14px] font-light pe-2 ps-2  border-[0.1px]  border-solid rounded-[10px]">
                    <DevIcon skillName={skill}></DevIcon>
                    {skill}
                  </div>
                );
              })}
            </div>
            <div className="project-desc  mt-4 text-[14px]">
              {project.description  }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectModal;