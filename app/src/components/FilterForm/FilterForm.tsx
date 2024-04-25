"use client";
import { useFetchAllJobs } from "@/hooks/useJobData";
import { useFilterStore } from "@/store/filterStore";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Loader from "../ui/Loader";

function FilterForm() {
  const [loading, setLoading] = useState(false);
  // const { filters, setFilter } = useFilterStore();
  const filters = useFilterStore((state) => state.filters);
  const setFilter = useFilterStore((state) => state.setFilter);

  const { refetch } = useFetchAllJobs();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFilter({ ...filters, [name]: value });
  };
  const handleExperienceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFilter({
      ...filters,
      min_requiredExperience: value,
    });
  };

  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFilter({ ...filters, min_salary: value });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await refetch();
    setLoading(false);
  };
  const clearFilters = async () => {
    setLoading(true);
    setFilter({
      ...filters,
      min_requiredExperience: 0,
      min_salary: 0,
      location: "",
    });

    await refetch();
    await refetch();

    setLoading(false);
  };
  return (
    <>
      <form method="POST" className="flex ps-2 pe-2 pt-3 pb-3 flex-col gap-2">
        <div className="header text-[15px]">Filter</div>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleInputChange}
          className="w-full text-[15px] h-9 border-[2px] p-2 rounded"
        />

        <label className="block mb-2 text-[15px] mt-2">
          Max Experience:
          <div className="flex items-center mt-2">
            <input
              type="range"
              name="required_experience"
              min={0}
              max={40}
              value={filters.min_requiredExperience}
              onChange={handleExperienceChange}
              className="w-full appearance-none h-1  rounded-full bg-gray-300 outline-none"
            />
          </div>
          <div className=" text-[15px] mt-2">
            {filters.min_requiredExperience} years
          </div>
        </label>

        <label className="block mb-2 text-[15px] mt-2">
          Min Salary:
          <div className="flex items-center mt-2">
            <input
              type="range"
              name="salary"
              min={0}
              max={100}
              value={filters.min_salary}
              onChange={handleSalaryChange}
              className="w-full appearance-none h-1 rounded-full bg-gray-300 outline-none "
            />
          </div>
          <div className="text-[15px] mt-2">${filters.min_salary}</div>
        </label>

        {loading ? (
          <>
            {" "}
            <div className="btn-container flex items-center gap-2 mt-2">
              <Loader size="25px"></Loader>{" "}
            </div>
          </>
        ) : (
          <div className="btn-container flex items-center gap-2 mt-2">
            <button
              className="submit-btn rounded-full px-2 py-1 text-[white] hover:bg-green-600 bg-green-500   text-[15px] font-medium	flex items-center"
              onClick={handleSubmit}
            >
              Apply
            </button>
            <button
              className="submit-btn rounded-full px-2 py-1 text-[white] hover:bg-green-600 bg-green-500   text-[15px]  font-medium	"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export default FilterForm;
