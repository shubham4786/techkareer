"use client";
import React, { ChangeEvent, useState } from "react";
import { DevIcon } from "../components";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { ZodErrorResponse } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../ui/Loader";
interface JobProfileFormData {
  role: string;
  requiredExperience: string;
  employeeType: string;
  salary: string;
  location: string;
  jobDescription: string;
  skillsRequired: string[];
}


const postJobseeker = async (data: JobProfileFormData) => {
  try {
    const response = await axios({
      method: "post",
      url: `/api/jobs`,
      data: {...data,
        requiredExperience:parseInt(data.requiredExperience),
        salary:parseInt(data.salary)
      },
    });
    toast.success("Job posted!");
    return await response.data
  } catch (error) {
    console.log(error)
    if (isAxiosError(error) && error.response?.status == 403) {
      if (error.response?.data.error.name == "ZodError") {
        let listOfZodIssues: ZodErrorResponse = error.response?.data;

        listOfZodIssues.error.issues.map((issue) => toast.error(issue.message));
        throw Error("Validation");
      } else if(error) {
        toast.error(error.response?.data.error);
        throw Error(error.response?.data.error);
      }
    } 
    else if(isAxiosError(error) && error.response?.status != 500){
      toast.error(error.response?.data.error);
        throw Error(error.response?.data.error);
    }
    else {
      toast.error("Internal Server Eror");
      throw Error("Internal Server Eror");
    }
  }
};

function JobPostingForm() {
  const [formData, setFormData] = useState<JobProfileFormData>({
    role: "",
    requiredExperience: "",
    employeeType: "",
    salary: "",
    location: "",
    jobDescription: "",
    skillsRequired: [],
  });
  const queryClient=useQueryClient()
  const { mutate: createJob, isPending } = useMutation({
    mutationFn: postJobseeker,
    onError(error) {
      console.log(error);
    },
    onSuccess: async () => {
      setFormData({
        role: "",
        requiredExperience: "",
        employeeType: "",
        salary: "",
        location: "",
        jobDescription: "",
        skillsRequired: [],
      });
      queryClient.invalidateQueries({ queryKey: ["all-jobs"] });
    },
  });
  
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const [inputListValue, setListValue] = useState<string>("");
  const handleListInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setListValue(e.target.value);
  };
  const handleEnter = (e: any) => {

    if (e.keyCode === 13 && inputListValue.trim() !== "") {
      // Update the list with a new item, and limit to 15 elements
      e.preventDefault(); // Prevent the default form submission behavior
      setFormData((prev) => {
        const updatedList = [inputListValue, ...prev.skillsRequired];
        setListValue(""); // Clear the input field after adding the item
        return { ...prev, skillsRequired: updatedList };
      });
    }
  };
  const handleDelete = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      skillsRequired: prevData.skillsRequired.filter((_, i) => i != index),
    }));
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    // log(formData)
    createJob(formData)
  };
  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="login-box max-sm:mt-0  mt-[3rem]    gap-[8px] max-sm:h-full max-sm:w-full h-[80%] border-[1px] border-[#e1e4e8]  flex   flex-col  items-center w-[28rem] px-3 py-1 overflow-auto"
      >
        <div className="text-[14px] font-500 py-3 border-b-[1px] w-full">
          Fill the below form to create a JobProfile
        </div>
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={formData.role}
          required
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />

          <input
            type="text"
            name="employeeType"
            placeholder="Type (e.g., Full Time)"
            required
            value={formData.employeeType}
            onChange={handleInputChange}
            className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="location (e.g., City,State )"
            required
            value={formData.location}
            onChange={handleInputChange}
            className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
          />

        <input
          type="number"
          name="salary"
          required
          placeholder="Salary"
          value={formData.salary}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />

        <textarea
          name="jobDescription"
          required
          placeholder="Description"
          value={formData.jobDescription}
          onChange={handleInputChange}
          className="w-full text-[14px]  border-[2px] p-2 rounded min-h-[5rem] max-h-[5rem]"
        />
        <input
          type="number"
          name="requiredExperience"
          required
          placeholder="No of year of Experience"
          value={formData.requiredExperience}
          min={0}
          max={50}
          onChange={handleInputChange}
          className="w-full text-[14px] h-15 border-[2px] p-2 rounded"
        />
        
        <div className="flex w-full gap-3 flex-wrap">
          {formData.skillsRequired.map((skill, index) => (
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

        <div className="login-btn-wrapper ">
          {isPending ? (
            <Loader size="20px"/>
          ) : (
            <button
              type="submit"
              className="submit-btn rounded-full px-3 py-1 text-[14px] text-[white] hover:bg-green-600 bg-green-500  "
            >
              Post
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default JobPostingForm;
