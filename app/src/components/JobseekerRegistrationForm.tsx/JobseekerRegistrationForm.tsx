"use client";
import React, { ChangeEvent, useState } from "react";
import { DevIcon } from "../components";
import { jobseekerPlaceHolder } from "@/assets/assets";
import { ZodErrorResponse } from "@/types/type";
import Image from "next/image";
import { toast } from "react-toastify";
import axios, { AxiosError, isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";
import Loader from "../ui/Loader";
import { signIn } from "next-auth/react";
interface SeekerFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  description: string;
  yearsOfExperience: number | string;
  phoneNumber: string;
  skills: string[];
  profilePic: File | null;
  resume: File | null;
}

const createJobseeker = async (data: SeekerFormData) => {
  try {
    const formData = new FormData();
    // Append fields to the FormData object
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append("skills", JSON.stringify(value));
      } else {
        if (value != null) {
          formData.append(key, value);
        }
      }
    });

    const response = await axios({
      method: "post",
      url: `/api/user/jobseeker`,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
    const updatedUser = await response.data.jobseeker
    toast.info("Welldone you are now part of Techkareer community");
    return updatedUser
  } catch (error) {
    if (isAxiosError(error) && error.response?.status == 403) {
      if (error.response?.data.error.name == "ZodError") {
        let listOfZodIssues: ZodErrorResponse = error.response?.data;

        listOfZodIssues.error.issues.map((issue) => toast.error(issue.message));
        throw Error("Validation");
      } else {
        toast.error(error.response?.data.error);
        throw Error(error.response?.data.error);
      }
    } else {
      toast.error("Internal Server Eror");
      throw Error("Internal Server Eror");
    }
  }
};

function JobseekerRegistrationForm() {
  const [inputListValue, setListValue] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutate: createUser, isPending: loader } = useMutation({
    mutationFn: createJobseeker,
    onError(error) {
      console.log(error);
    },
    onSuccess: async (data) => {
      signIn('credentials', {
        email: data.email,
        password: formData.password,
        type: 'Jobseeker',
        redirect: false,
      })
      setFormData({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        description: "",
        yearsOfExperience: "",
        phoneNumber: "",
        skills: [],
        profilePic: null,
        resume: null,
      });
      setSelectedImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["all-jobseekers"] });
      queryClient.invalidateQueries({ queryKey: ["seekers-for-section"] });
    },
  });

  const [formData, setFormData] = useState<SeekerFormData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    description: "",
    yearsOfExperience: "",
    phoneNumber: "",
    skills: [],
    profilePic: null,
    resume: null,
  });

  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    ("okay");
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
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setFormData((prevState) => ({
        ...prevState,
        profilePic: file,
      }));

      const previewUrl = URL.createObjectURL(file);
      setSelectedImagePreview(previewUrl);
    } else {
      toast.error("Please select an image file.");
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormData((prevState) => ({
      ...prevState,
      profilePic: null,
    }));
    setSelectedImagePreview(null);
    let imageInput = document.getElementById("imageInput") as HTMLInputElement;
    if (imageInput) {
      imageInput.value = "";
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "application/pdf") {
      setFormData((prevData) => ({
        ...prevData,
        resume: file,
      }));
    } else {
      toast.error("Please select a PDF file.");
      event.target.value = ""; // Clear the input field
    }
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    createUser(formData);
  };
  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="login-box max-sm:mt-0  mt-[3rem] gap-[8px] max-sm:h-full max-sm:w-full h-[80%] border-[1px] border-[#e1e4e8]  flex   flex-col  items-center w-[28rem] px-3 py-1 overflow-auto"
      >
        <div className="text-[14px] font-500 py-3 border-b-[1px] w-full">
          Fill the below form to create a Profile as seeker
        </div>
        <input
          type="text"
          name="username"
          placeholder="Grab a unique username !"
          value={formData.username}
          required
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />

        <div className="name-input flex w-full gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
          />
        </div>
        <input
          type="text"
          name="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />
        <textarea
          name="description"
          required
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full text-[14px]  border-[2px] p-2 rounded min-h-[5rem] max-h-[5rem]"
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
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />
        <input
          type="tel"
          name="phoneNumber"
          required
          placeholder="Phone No"
          maxLength={10}
          min={10}
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded "
        />
        <div className="flex w-full gap-3 flex-wrap">
          {formData.skills.map((skill, index) => (
            <div
              className="flex gap-2 items-center primary-text ps-2 pe-2 border-[0.2px] border-solid border-[#888c91] rounded-[10px] hover:bg-green-500 hover:text-white"
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
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />

        <div className="flex flex gap-2 justify-center items-center">
          <div className="flex ">
            {selectedImagePreview === null ? (
              <Image
                src={jobseekerPlaceHolder}
                className="rounded-full border-grey border-[0.2px] border-solid h-[4rem] w-[4.5rem] object-fill"
                alt=""
              />
            ) : (
              <>
                {" "}
                <img
                  src={selectedImagePreview?.toString()}
                  className="rounded-full h-[5rem] w-[5.5rem] object-contain"
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
          <div className="flex flex-col justify-center items-center">
            <label
              htmlFor="imageInput"
              className="h-8 text-[14px] text-[#22C55E] hover:bg-green-500 hover:text-white px-2 py-2 text-[14px]   border-none rounded cursor-pointer select-none inline-block mt-4"
            >
              Choose a profile picture
            </label>
            <div className="optional text-[14px] text-[#a4a8ae]">Optional</div>
          </div>
        </div>

        <div className="flex items-center justify-center flex-col">
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className="flex flex-col items-center text-[14px] text-[#22C55E]">
            <label
              htmlFor="fileInput"
              className=" h-8 text-[14px] text-[#22C55E] hover:bg-green-500 hover:text-white px-2 py-2 text-[14px]   border-none rounded cursor-pointer select-none inline-block mt-4"
            >
              Upload your resume
            </label>

            <div className="optional text-[14px] text-[#a4a8ae]">Optional</div>
          </div>
          {formData.resume && <div>Selected file: {formData.resume.name}</div>}
        </div>

        <div className="login-btn-wrapper ">
          {loader ? (
            <Loader size="20px"></Loader>
          ) : (
            <button
              type="submit"
              className="submit-btn rounded-full px-3 py-1 text-[14px] text-[white] hover:bg-green-600 bg-green-500  "
            >
              SignUp
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default JobseekerRegistrationForm;
