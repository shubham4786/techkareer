"use client";
import { organizationPlaceHolder } from "@/assets/assets";
import { ZodErrorResponse } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";
import { signIn } from "next-auth/react";

interface OrganizationFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  overview: string;
  location: string;
  foundedAt: number | string;
  website: string;
  profilePic: File | null;
}

const addOrganization = async (data: OrganizationFormData) => {
  const formData = new FormData();

  // Append fields to the FormData object
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value instanceof File) {
      if (value != null) {
        formData.append(key, value);
      }
    } else {
      if (value != null) {
        formData.append(key, value);
      }
    }
  }

  // Send the request
  try {
    const response = await axios.post((`/api/user/organization`), formData, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
    toast.info("Welldone you are now part of Techkareer community");
    const org = await response.data.organization
    return org
  } catch (error) {
    if (isAxiosError(error) && error.response?.status == 403) {
      if (error.response?.data.error.name == "ZodError") {
        let listOfZodIssues: ZodErrorResponse = error.response?.data;

        listOfZodIssues.error.issues.map((issue) =>
          toast.error(issue.message)
        );
        throw Error("Validation error");
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

function CompanyRegistrationForm() {
  const [formState, setFormState] = useState<OrganizationFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    overview: "",
    location: "",
    foundedAt: "",
    website: "",
    profilePic: null,
  });
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);
  const queryClient = useQueryClient();

  const {
    mutate: createOrganization,
    isPending: loader,
    error,
  } = useMutation({
    mutationFn: addOrganization,
    onError(error, variables, context) {
      console.log(error)
    },
    onSuccess: async (data) => {
      // console.log(error);
      signIn('credentials', {
        email: data.email,
        password: formState.password,
        type: 'Organization',
        redirect: false,
      })
      queryClient.invalidateQueries({ queryKey: ["all-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["org-for-section"] });
      setSelectedImagePreview(null);
      setFormState({
        name: "",
        username: "",
        email: "",
        password: "",
        overview: "",
        location: "",
        foundedAt: "",
        website: "",
        profilePic: null,
      });

    },
  });
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setFormState((prevState) => ({
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
    setFormState((prevState) => ({
      ...prevState,
      profilePic: null,
    }));
    setSelectedImagePreview(null);
    let imageInput = document.getElementById("imageInput") as HTMLInputElement;
    if (imageInput) {
      imageInput.value = "";
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    // Add your form submission logic here
    // Validation
    if (!formState.name.trim()) {
      toast.error("Name is required");
      return;
    }
    // if (formState.profile_pic === null) {
    //   toast.error("Profile pic is required");
    //   return;
    // }
    if (!formState.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!formState.email.trim()) {
      toast.error("Email is required");
      return;
    }
    // Add more validations as needed
    createOrganization(formState);
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="login-box max-sm:mt-0  mt-[3rem] max-sm:py-2 gap-[8px] max-sm:h-full max-sm:w-full h-[80%] border-[1px] border-[#e1e4e8]  flex   flex-col  items-center w-[28rem] px-3 py-1 overflow-auto"
      >
        <div className="text-[14px] font-500 py-3 border-b-[1px] w-full">
          Fill the below form to create a Organization
        </div>
        <input
          type="text"
          name="name"
          placeholder="Name of the Organization"
          value={formState.name}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded "
        />
        <input
          type="text"
          name="username"
          placeholder="Grab a unique username for your Company !"
          value={formState.username}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded "
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded "
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded "
        />
        <textarea
          name="overview"
          placeholder="Overview about your Company"
          value={formState.overview}
          onChange={handleInputChange}
          className="w-full text-[14px]  border-[2px] p-2 rounded min-h-[5rem] max-h-[5rem]"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formState.location}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded "
        />
        <input
          type="number"
          name="foundedAt"
          placeholder="Enter the year of foundation"
          min="1900"
          max="2100"
          value={formState.foundedAt}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded "
        />
        <input
          name="website"
          placeholder="Website"
          // type="url"
          value={formState.website}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />
        {/* Image upload section */}
        <div className="flex flex gap-2 justify-center items-center">
          <div className="flex ">
            {selectedImagePreview === null ? (
              <Image
                alt=""
                src={organizationPlaceHolder}
                className="rounded-full border-grey border-[0.2px] border-solid h-20 w-20 object-contain"
              />
            ) : (
              <>
                {" "}
                <img
                  src={selectedImagePreview?.toString()}
                  className="rounded-full h-20 w-20 object-contain"
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
              className=" h-8 text-[14px] text-[#22C55E] hover:bg-[#13883e] hover:text-white px-2 py-2 text-[14px]   border-none rounded cursor-pointer select-none inline-block mt-4"
            >
              Choose a profile picture
            </label>
            <div className="optional text-[14px] text-[#a4a8ae]">Optional</div>
          </div>
        </div>
        {/* Submit button */}
        <div className="login-btn-wrapper ">
          {loader ?
            <Loader size="22px"></Loader>
            : <button
              type="submit"
              className="submit-btn rounded-full px-3 py-1 text-[14px] text-[white] hover:bg-green-600 bg-green-500  "
            >
              SignUp
            </button>}
        </div>
      </form>
    </>
  );
}

export default CompanyRegistrationForm;
