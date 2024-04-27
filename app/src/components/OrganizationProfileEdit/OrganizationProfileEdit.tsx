'use client'
import { appendToBaseUrl } from '@/hooks/hooks';
import { useGetLoggedInOrganization } from '@/hooks/useOrganizationData';
import { Organization } from '@/types/type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loader from '../ui/Loader';

interface OrgFormData {
  email: string;
  name: string;
  location: string;
  website?: string;
  overview: string;
  foundedAt: string;
}
function OrganizationProfileEdit() {
  const { data: authData,update } = useSession();
  const { data: currUser, isLoading } = useGetLoggedInOrganization();
  const [formData, setFormData] = useState<OrgFormData>({
    email: "",
    name: "",
    location:"",
    website: "",
    overview: "",
    foundedAt: "",
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
  useEffect(() => {
    setFormData({
      email: currUser?.email??'',
      name: currUser?.name??'',
      location: currUser?.location??'',
      website: currUser?.website?(currUser?.website):'',
      overview: currUser?.overview??'',
      foundedAt: currUser?.foundedAt?currUser?.foundedAt.toString():''
    });
    console.log(currUser)
  }, [currUser]);
  const queryClient = useQueryClient();
  const { mutate: updateDetail, isPending } = useMutation({
    mutationFn: async (data: OrgFormData) => {
      axios.put(appendToBaseUrl("user/organization/edit"), data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["me", 'organzation'],
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
        
        const response=await axios.put(appendToBaseUrl("user/organization/edit/profilepic"), formData, {
          headers: {
            "Content-Type": `multipart/form-data`,
          },
        });
        const updatedUser=await response.data
        update({
          user: {
            username: updatedUser.user.username,
            role: "Organization",
            id: updatedUser.user.id,
            image: updatedUser.user.profilePic,
            name: updatedUser.user.name,
          },
        });
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["me",'organzation'],
        });
        setChangedProfilePic(null);
        toast.success("Updated Successfully");
        await queryClient.refetchQueries({
          queryKey: ["me",'organzation'],
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

  return (
    <>
    <div className="scrollable-content   flex flex-col  items-center w-full overflow-x-hidden overflow-y-auto ">
      <div className="flex flex-col  w-full py-3  border-b-[1px] border-b-[lgt-grey]  border-b-solid border-t-[1px] border-t-[lgt-grey]  border-t-solid  mt-4 gap-2 justify-center items-center">
        <div className="header text-[14px] ">Edit The Profile Pic here</div>
        <div className="flex ">
          {profilePicLoading||isLoading ? (
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
      
      {isLoading ? (
        <Loader size="30px"></Loader>
      ) : (
        <form
          method="POST"
          onSubmit={handleSubmit}
          className=" p-[1rem] px-[2rem]   flex gap-[1rem] mt-3 mb-3 flex-col items-center justify-center w-full  "
        >
          <div className="header text-[14px] ">Edit The details here</div>{" "}
            <input
              type="text"
              name="name"
              placeholder="Name of Organization"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
            />
            
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
            name="overview"
            required
            placeholder="Overview"
            value={formData.overview}
            onChange={handleInputChange}
            className="w-full text-[12px] h-20 border-[2px] p-2 rounded min-h-10 max-h-[7rem]"
          />
          <input
            type="text"
            name="location"
            required
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
          />
          <input
            type="text"
            name="foundedAt"
            required
            placeholder="foundedAt e.g.(1992)"
            
            value={formData.foundedAt}
            onChange={handleInputChange}
            className="w-full text-[13px] h-10 border-[2px] p-2 rounded "
          />
         
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="website"
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
  </>  )
}

export default OrganizationProfileEdit