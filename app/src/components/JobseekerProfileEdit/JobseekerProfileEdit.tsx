"use client";
import { appendToBaseUrl } from "@/hooks/hooks";
import { useGetLoggedInUser } from "@/hooks/useJobseekerData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { toast } from "react-toastify";
import { DevIcon } from "../components";
import Loader from "../ui/Loader";

interface SeekerFormData {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  yearsOfExperience: number | string;
  phoneNumber: string;
  skills: string[];
}

function JobseekerProfileEdit() {
  const { data: authData, update } = useSession();
  const [inputListValue, setListValue] = useState<string>("");
  const { data: currUser, isLoading } = useGetLoggedInUser();

  const [formData, setFormData] = useState<SeekerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    yearsOfExperience: 0,
    phoneNumber: "",
    skills: [],
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
  const handleListInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setListValue(e.target.value);
  };
  const handleEnter = (e: any) => {
    if (e.keyCode === 13 && inputListValue.trim() !== "") {
      // Update the list with a new item, and limit to 15 elements
      e.preventDefault(); // Prevent the default form submission behavior

      setFormData((prev) => {
        const updatedList = [inputListValue, ...prev.skills];
        setListValue(""); // Clear the input field after adding the item
        return { ...prev, skills: updatedList };
      });
    }
  };
  const handleDelete = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((_, i) => i !== index),
    }));
  };
  useEffect(() => {
    setFormData({
      firstName: currUser?.firstName || "",
      lastName: currUser?.lastName || "",
      email: currUser?.email || "",
      description: currUser?.description || "",
      yearsOfExperience: currUser?.yearsOfExperience || 0,
      phoneNumber: String(currUser?.phoneNumber) || "",
      skills: currUser?.skills || [],
    });
  }, [currUser]);

  const queryClient = useQueryClient();
  const { mutate: updateDetail, isPending } = useMutation({
    mutationFn: async (data: SeekerFormData) => {
      axios.put(appendToBaseUrl("user/jobseeker/edit"), data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["me", authData?.user.username],
      });
      toast.success("Updated Successfully");
    },
  });
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault(); // Prevent
    // if (!formData.profile_pic || !formData.resume) {
    //   toast.error("Please upload both a profile picture and a resume.");
    //   return;
    // }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }
    updateDetail(formData);
  };
  //Image operation

  const { mutate: updateProfilePicture, isPending: profilePicLoading } =
    useMutation({
      mutationFn: async (data: File) => {
        const formData = new FormData();
        formData.append("profilePic", data);
        const response = await axios.put(
          appendToBaseUrl("user/jobseeker/edit/profilepic"),
          formData,
          {
            headers: {
              "Content-Type": `multipart/form-data`,
            },
          }
        );
        const updatedUser = await response.data;
        console.log(response, updatedUser.user.profilePic);
        update({
          user: {
            username: updatedUser.user.username,
            role: "Jobseeker",
            id: updatedUser.user.id,
            image: updatedUser.user.profilePic,
            name: updatedUser.user.name,
          },
        });
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["me", authData?.user.username],
        });
        setChangedProfilePic(null);
        toast.success("Updated Successfully");
        await queryClient.refetchQueries({
          queryKey: ["me", authData?.user.username],
        });
      },
    });

  const [changedProfilePic, setChangedProfilePic] = useState<File | null>();
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setChangedProfilePic(file);
    } else {
      toast.error("Please select an image file.");
      let imageInput = document.getElementById("imageInput");
      if (imageInput) {
        imageInput.nodeValue = "";
      }
      event.target.value = ""; // Clear the input field
    }
  };
  const handleRemoveImage = () => {
    // Clear the selected image and preview
    setChangedProfilePic(null);
    let imageInput = document.getElementById("imageInput");
    if (imageInput) {
      imageInput.nodeValue = "";
    }
  };
  const handleProfilePicUpdate = () => {
    if (changedProfilePic) updateProfilePicture(changedProfilePic);
  };

  //Resume operation

  const { mutate: updateResume, isPending: resumeLoading } = useMutation({
    mutationFn: async (data: File) => {
      const formData = new FormData();
      formData.append("resume", data);
      axios.put(appendToBaseUrl("user/jobseeker/edit/resume"), formData, {
        headers: {
          "Content-Type": `multipart/form-data`,
        },
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["me", authData?.user.username],
      });
      setChangedResume(null);
      toast.success("Updated Successfully");
      await queryClient.refetchQueries({
        queryKey: ["me", authData?.user.username],
      });
    },
  });

  const [changedResume, setChangedResume] = useState<File | null>();
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "application/pdf") {
      setChangedResume(file);
    } else {
      toast.error("Please select a PDF file.");
      event.target.value = ""; // Clear the input field
    }
  };
  const handleRemoveResume = () => {
    // Clear the selected image and preview
    setChangedResume(null);
    let resumeInput = document.getElementById("fileInput");
    if (resumeInput) {
      resumeInput.nodeValue = "";
    }
  };
  const handleResumeUpdate = () => {
    if (changedResume) updateResume(changedResume);
  };
  return (
    <>
      <div className="scrollable-content   flex flex-col  items-center w-full overflow-x-hidden overflow-y-auto ">
        <div className="flex flex-col   py-3  border-b-[1px] border-b-[lgt-grey]  border-b-solid border-t-[1px] border-t-[lgt-grey]  border-t-solid  mt-4 gap-2 justify-center items-center">
          <div className="header text-[14px] ">Edit The Profile Pic here</div>
          <div className="flex ">
            {profilePicLoading || isLoading ? (
              <Loader size="30px"></Loader>
            ) : // <Loader message=""></Loader>
            !changedProfilePic ? (
              currUser ? (
                <img
                  src={currUser.profilePic}
                  className=" border-grey flex items-center justify-center border-[0.2px] border-solid h-[5rem] w-[5rem] "
                />
              ) : (
                <div className="border-grey flex items-center justify-center text-[14px] border-[0.2px] border-solid h-[5rem] w-[5rem] ">
                  Choose a Picture to update
                </div>
              )
            ) : (
              <>
                {" "}
                <img
                  src={URL.createObjectURL(changedProfilePic)}
                  className="border-grey flex items-center justify-center text-[14px] border-[0.2px] border-solid h-[5rem] w-[5rem] "
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
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <div className="flex flex-col justify-start items-center">
            {changedProfilePic ? (
              <div
                onClick={handleProfilePicUpdate}
                className="save-btn flex items-center text-[13px] text-[white] bg-[#22C55E] hover:bg-[#13883e] hover:text-white px-2 py-2 text-[13px]   border-none rounded cursor-pointer select-none inline-block mt-2"
              >
                Click to save profile pic
              </div>
            ) : (
              <label
                htmlFor="imageInput"
                className="flex items-center text-[13px] text-[white] bg-[#22C55E] hover:bg-[#13883e] hover:text-white px-2 py-2 text-[13px]   border-none rounded cursor-pointer select-none inline-block mt-2"
              >
                Choose a profile picture
              </label>
            )}
          </div>
        </div>
        <div className="flex w-full py-3  border-b-[1px] border-b-[lgt-grey]  border-b-solid border-t-[1px] border-t-[lgt-grey]  border-t-solid   items-center justify-center flex-col">
          {currUser?.resume && (
            <div className="flex items-center gap-2">
              <div className="text-[14px]">Your Existing Resume:</div>
              <a
                href={currUser.resume}
                download={currUser.resume}
                className="flex cursor-pointer items-center border-[1px] px-2 py-1 rounded-full border-solid border-[lgt-grey]"
              >
                <FaRegFilePdf className=" text-[red] text-[20px]" />
              </a>
            </div>
          )}

          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center text-[13px] text-[#22C55E]">
            {resumeLoading || isLoading ? (
              <Loader size="30px"></Loader>
            ) : (
              <div className="flex items-center gap-2">
                <div className="mt-2">
                  Selected file: {changedResume ? changedResume.name : "None"}
                </div>
                {changedResume && (
                  <div
                    onClick={handleRemoveResume}
                    className="cursor-pointer text-[red] cursor-pointer "
                  >
                    X
                  </div>
                )}
              </div>
            )}

            {changedResume ? (
              <div
                onClick={handleResumeUpdate}
                className="  text-[13px] text-white bg-[#22C55E] hover:bg-[#13883e] hover:text-white px-2 py-2    border-none rounded cursor-pointer select-none inline-block mt-4"
              >
                {" "}
                Click to save resume
              </div>
            ) : (
              <label
                htmlFor="fileInput"
                className="  text-[13px] text-white bg-[#22C55E] hover:bg-[#13883e] hover:text-white px-2 py-2    border-none rounded cursor-pointer select-none inline-block mt-4"
              >
                Click to updated your resume
              </label>
            )}
            {/* <div className="optional text-[13px] text-[#a4a8ae]">
                    Optional
                  </div> */}
          </div>
        </div>
        {isLoading ? (
          <Loader size="30px"></Loader>
        ) : (
          <form
            method="POST"
            onSubmit={handleSubmit}
            className=" p-[1rem] px-[2rem]   flex gap-[1rem] mt-3 mb-3 flex-col items-center justify-center w-full  "
          >
            <div className="header text-[14px] ">Edit The details here</div>{" "}
            <div className="name-input flex w-full gap-2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
              />
            </div>
            <input
              type="text"
              name="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
            />
            <textarea
              name="description"
              required
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full text-[12px] h-20 border-[2px] p-2 rounded min-h-10 max-h-[7rem]"
            />
            <input
              type="number"
              name="yearsOfExperience"
              required
              placeholder="No of year of Experience"
              value={formData.yearsOfExperience}
              min={0}
              max={50}
              onChange={handleInputChange}
              className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
            />
            <input
              type="tel"
              name="phoneNumber"
              required
              placeholder="Phone No"
              maxLength={10}
              min={10}
              // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full text-[13px] h-10 border-[2px] p-2 rounded "
            />
            <div className="flex w-full gap-3 flex-wrap">
              {formData.skills.map((skill, index) => (
                <div
                  className="flex gap-2 items-center primary-text ps-2 pe-2 border-[0.2px] border-solid border-[#888c91] rounded-[10px] hover:bg-[#13883e] hover:text-white"
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
              placeholder="Add Skills"
              className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
            />
            <div className="login-btn-wrapper ">
              {isPending ? (
                <>
                  <Loader size="30px"></Loader>
                </>
              ) : (
                <button
                  type="submit"
                  className="submit-btn rounded-[5px] px-2 py-1 text-[white] hover:bg-green-600 bg-green-500   text-[13px]  font-medium	 "
                >
                  Edit Details
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default JobseekerProfileEdit;
