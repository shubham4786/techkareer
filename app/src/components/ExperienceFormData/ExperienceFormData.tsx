import { useState, useEffect, useRef } from "react";
import { IoCloseCircle } from "react-icons/io5";
import Loader from "../ui/Loader";
import { useAddExperience, useUpdateExperience } from "@/hooks/useExperienceData";

function ExperienceFormData({ close,updateData,type }: {type:"ADD"|"EDIT", close: () => void, updateData?:{
    id:string,
    role: string,
    company: string,
    startMonth: string,
    startYear: string,
    endMonth: string,
    endYear: string,
  }}) {
  const [formData, setFormData] = useState({
    role: updateData?.role?updateData?.role:"",
    company: updateData?.company?updateData?.company:"",
    startMonth: updateData?.startMonth?updateData.startMonth:"",
    startYear: updateData?.startYear||"",
    endMonth: updateData?.endMonth||"",
    endYear: updateData?.endYear||"",
  });
  
  const modalContainer = useRef<HTMLFormElement>(null);
  const {mutate:updateExperienceData,isPending:isUpdateLoading}=useUpdateExperience()
  const {mutate:addExperience,isPending:isExperienceLoading}=useAddExperience()
 
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here using formData state

    if(type=='ADD'){
        addExperience(formData)
    }
    if(type=='EDIT'){
        updateExperienceData({
            id:String(updateData?.id),
            role:formData.role,
            company:formData.company,
            startYear:formData.startYear,
            startMonth:formData.startMonth,
            endMonth:formData.endMonth,
            endYear:formData.endYear
        })
    }
  };

  return (
    <>
      <div className="overlay absolute top-0 left-0 z-50 w-[100vw] h-[100vh] bg-gray-400 opacity-30  flex items-center justify-center  "></div>
      <div className="overlay  absolute top-0 left-0 z-[100] w-[100vw] h-[100vh]   flex items-center  justify-center  ">
        <form
          
          ref={modalContainer}
          onSubmit={handleSubmit}
          className="border-1 border-solid border-[lgt-grey] rounded-[10px] flex w-[30rem] max-sm:w-full bg-white ps-4 pe-4 pt-4 pb-4 flex-col gap-1"
        >
          <div className="w-full flex justify-between items-center ">
            {true ? "Update Experience" : "Add Experiences Details"}
            <IoCloseCircle
              onClick={() => close()}
              className="text-[22px] cursor-pointer"
            ></IoCloseCircle>
          </div>
          <label className="block mb-2 text-[13px] mt-3">
            Role :
            <input
              type="text"
              name="role"
              placeholder="Role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full text-[14px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            />
          </label>

          <label className="block mb-2 text-[13px] mt-1">
            Name of the Company:
            <input
              type="text"
              name="company"
              placeholder="Name of the Company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full text-[13px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            />
          </label>
          <label className="block mb-2 text-[13px] mt-1">
            Start Month of your experience:
            <select
              name="startMonth"
              value={formData.startMonth}
              onChange={handleChange}
              required
              className="w-full text-[13px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            >
              <option value="">Select Month</option>
              <option value="Jan">Jan</option>
              <option value="Feb">Feb</option>
              <option value="Mar">Mar</option>
              <option value="Apr">Apr</option>
              <option value="May">May</option>
              <option value="Jun">Jun</option>
              <option value="Jul">Jul</option>
              <option value="Aug">Aug</option>
              <option value="Sep">Sep</option>
              <option value="Oct">Oct</option>
              <option value="Nov">Nov</option>
              <option value="Dec">Dec</option>
            </select>
          </label>
          <label className="block mb-2 text-[13px] mt-1">
            Start Year of your Experience :
            <input
              type="text"
              name="startYear"
              placeholder="Start year of your experience"
              required
              value={formData.startYear}
              onChange={handleChange}
              className="w-full text-[13px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            />
          </label>

          <label className="block mb-2 text-[13px] mt-1">
            End Month of the year:
            <select
              name="endMonth"
              value={formData.endMonth}
              onChange={handleChange}
              className="w-full text-[13px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            >
              <option value="">Select Month</option>
              <option value="Jan">Jan</option>
              <option value="Feb">Feb</option>
              <option value="Mar">Mar</option>
              <option value="Apr">Apr</option>
              <option value="May">May</option>
              <option value="Jun">Jun</option>
              <option value="Jul">Jul</option>
              <option value="Aug">Aug</option>
              <option value="Sep">Sep</option>
              <option value="Oct">Oct</option>
              <option value="Nov">Nov</option>
              <option value="Dec">Dec</option>{" "}
            </select>
          </label>
          <label className="block mb-2 text-[13px] mt-1">
            End year of Experience :
            <input
              type="text"
              name="endYear"
              placeholder="End year of your experience"
              value={formData.endYear}
              onChange={handleChange}
              className="w-full text-[13px] mt-1 h-9 border-[2px] ps-2 pe-2 rounded"
            />
          </label>
          <div className="login-btn-wrapper w-full flex justify-center mt-2">
            {isExperienceLoading||isUpdateLoading ? (
              <>
                {/* <ReactLoading
                  type="bubbles"
                  color="green"
                  height={10}
                  className="flex items-center  overflow-hidden mt-2"
                /> */}
                <Loader size="20px"></Loader>
              </>
            ) : (
              <button
                type="submit"
                className="submit-btn rounded-full px-3 py-1 text-[14px] text-[white] hover:bg-green-600 bg-green-500  "
                >
                {true ? "Update Experience" : "Add Experience"}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default ExperienceFormData;