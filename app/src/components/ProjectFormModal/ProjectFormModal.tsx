import { IoCloseCircle } from "react-icons/io5";
import DevIcon from "../Devicon/Devicon";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import unknown from "../../assets/unknown.png";
import { toast } from "react-toastify";
import { useAddProject, useUpdateProject } from "../../hooks/useProjectData";
import { projectPlaceholder } from "@/assets/assets";
import Image from "next/image";
import Loader from "../ui/Loader";

interface ProjectData {
  name: string;
  repoLink:string;
  deployedLink: string;
  description: string;
  techStack: string[];
  image: File | null;
}

function ProjectFormModal({
  close,
  type,
  updateData,
}: {
  close: () => void;
  type: string;
  updateData?: {
    id: string;
    name: string;
    deployedLink?: string;
    repoLink?: string;
    description: string;
    techStack: string[];
    image: string|null;
  };
}) {
  const { mutate: addProject, isPending: loadAddingProject } = useAddProject();
  const { mutate: updateProject, isPending: loadUpdateProject } =
    useUpdateProject();
  const [inputListValue, setListValue] = useState<string>("");

  const [formData, setFormData] = useState<ProjectData>({
    name: updateData?.name || "",
    repoLink: updateData?.repoLink || "",
    deployedLink: updateData?.deployedLink || "",
    description: updateData?.description || "",
    techStack:
      updateData?.techStack && updateData.techStack.length > 0
        ? updateData.techStack
        : [],
    image: null,
  });
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  console.log(updateData)
  const handleListInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setListValue(e.target.value);
  };

  const handleDelete = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      techStack: prevData.techStack.filter((_, i) => i !== index),
    }));
  };

  const handleEnter = (e: any) => {
    if (e.keyCode === 13 && inputListValue.trim() !== "") {
      // Update the list with a new item, and limit to 15 elements
      e.preventDefault(); // Prevent the default form submission behavior

      setFormData((prev) => {
        const updatedList = [inputListValue, ...prev.techStack];
        setListValue(""); // Clear the input field after adding the item
        return { ...prev, techStack: updatedList };
      });
    }
  };
  const handleRemoveImage = () => {
    // Clear the selected image and preview
    setFormData((prev) => {
      return { ...prev, image: null };
    });
    // Clear the input field
    let imageInput = document.getElementById("imageInput");
    if (imageInput) {
      // Clear the input field
      imageInput.nodeValue = "";
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    } else {
      toast.error("Please select an image file.");
      event.target.value = ""; // Clear the input field
    }
  };

  const modalContainer = useRef<HTMLFormElement>(null);
  const handleOutsideClick = (e: MouseEvent) => {
    if (
      modalContainer.current &&
      !modalContainer.current.contains(e.target as Node)
    ) {
      close();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    // console.log(formData)
    if (type == "ADD") {
      addProject(formData);
    } else if (type == "EDIT" && updateData && updateData.id) {
      updateProject({
        id:parseInt(updateData.id),
        name: formData.name,
        description: formData.description,
        deployedLink: formData.deployedLink,
        repoLink: formData.repoLink,
        techStack: formData.techStack,
      });
    }
  };
  return (
    <>
      <div className="overlay absolute top-0 left-0 z-50 w-[100vw] h-[100vh] bg-gray-400 opacity-30  flex items-center justify-center  "></div>
      <div className="overlay  absolute top-0 left-0 z-50 w-[100vw] h-[100vh]   flex items-center  justify-center  ">
        <form
          ref={modalContainer}
          onSubmit={handleSubmit}
          className="border-1 border-solid border-[lgt-grey] rounded-[10px] flex w-[30rem] max-sm:w-full bg-white ps-4 pe-4 pt-4 pb-4 flex-col gap-1"
        >
          <div className="w-full flex justify-between items-center ">
            {type=='EDIT'?"Update Project":"Add Projects Details"}
            <IoCloseCircle
              onClick={() => close()}
              className="text-[22px] cursor-pointer"
            ></IoCloseCircle>
          </div>
          <label className="block mb-2 text-[13px] mt-3">
            Project Name :
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full text-[14px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            />
          </label>

          <label className="block mb-2 text-[13px] mt-2">
            Project Description :
            <textarea
              name="description"
              required
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full text-[12px] mt-1 h-20 border-[2px] p-2 rounded min-h-[2.5rem] max-h-[7rem]"
            />
          </label>
          <label className="block mb-2 text-[13px] mt-1">
            Deployed Link :
            <input
              type="text"
              name="deployedLink"
              placeholder="Deployed Link (optional)"
              value={formData.deployedLink}
              onChange={handleInputChange}
              className="w-full text-[13px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            />
          </label>
          <label className="block mb-2 text-[13px] mt-1">
            Repo Link :
            <input
              type="text"
              name="repoLink"
              placeholder="Repo Link (optional)"
              value={formData.repoLink}
              onChange={handleInputChange}
              className="w-full text-[13px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            />
          </label>
          <label className="block mb-1 text-[13px] mt-1">
            Tech Skills :
            <div className="flex w-full gap-3 flex-wrap mt-2  mb-2">
              {formData.techStack.map((skill, index) => (
                <div
                  className="flex gap-2 truncate items-center primary-text ps-2 pe-2 border-[0.2px] border-solid border-[#888c91] rounded-[10px] hover:bg-[#13883e] hover:text-white"
                  key={index}
                >
                  <DevIcon skillName={skill}></DevIcon>
                  {skill}
                  <div
                    className="cancel-button cursor-pointer"
                    onClick={() => handleDelete(index)}
                  >
                    x
                  </div>
                </div>
              ))}
            </div>
            <input
              type="text"
              name="skills"
              value={inputListValue}
              onChange={handleListInputChange}
              onKeyDown={handleEnter}
              placeholder="Add skills"
              className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
            />
          </label>

          <div className="flex  flex-col gap-2 mt-2 justify-center items-center">
            <div className="flex ">
              {updateData?.image ? (
                <>
                  {/* <img
                    src={updateData.image}
                    className="h-[4rem] w-[6rem] "
                  /> */}
                </>
              ) : formData.image=== null ? (
                <Image
                alt=""
                  src={projectPlaceholder}
                  className="border-grey border-[0.2px] border-solid h-[4rem] w-[6rem] object-contain"
                />
              ) : (
                <>
                  {" "}
                  <img
                    src={URL.createObjectURL(formData.image)}
                    className="h-[4rem] w-[6rem] object-contain"
                  />
                  <span
                    onClick={handleRemoveImage}
                    className="  px-1 py-1
                                      text-lg
                                      text-red-500

                                      border-none
                                      rounded
                                      cursor-pointer
                    "
                  >
                    x
                  </span>
                </>
              )}
            </div>
            {updateData?.name ? (
              <></>
            ) : (
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            )}
            {updateData?.name ? (
              <></>
            ) : (
              <div className="flex  justify-center gap-2 mt-2 items-center">
                <label
                  htmlFor="imageInput"
                  className=" h-8 text-[13px] text-[#22C55E] hover:bg-[#13883e] hover:text-white px-2 py-2 text-[13px]   border-none rounded cursor-pointer select-none inline-block "
                >
                  Upload a Picture
                </label>
                <div className="optional text-[13px] pt-1 text-[#a4a8ae]">
                  Optional
                </div>
              </div>
            )}
          </div>
          <div className="login-btn-wrapper w-full flex justify-center mt-2">
            {loadAddingProject || loadUpdateProject ? (
              <>
                <Loader size="20px"></Loader>
              </>
            ) : (
              <button
                type="submit"
            className="submit-btn rounded-full px-3 py-1 text-[14px] text-[white] hover:bg-green-600 bg-green-500  "
              >
                {type == "EDIT" ? "Update Project" : "Add Project"}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default ProjectFormModal;