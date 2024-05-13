"use client";
import { useFetchAllJobs } from "@/hooks/useJobData";
import { useFilterStore } from "@/store/filterStore";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Loader from "../ui/Loader";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";
import { ArrowRight, Trash } from "lucide-react";

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
  const handleExperienceChange = (value: number) => {
    setFilter({
      ...filters,
      min_requiredExperience: value,
    });
  };

  const handleSalaryChange = (value: number) => {
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
          className="w-full text-[15px] h-9 border-[1px] border-gray-600 p-2 outline-none bg-transparent rounded-lg text-white "
        />

        <label className="block mb-2 text-[15px] mt-2">
          Max Experience:
          <div className="flex items-center mt-2">
            <Slider
              min={0}
              defaultValue={[0]}
              max={100}
              step={1}
              onValueChange={(e) => handleExperienceChange(e[0])}
              className={cn("w-[100%]")}
            />
          </div>
          <div className=" text-[15px] mt-2">
            {filters.min_requiredExperience} years
          </div>
        </label>

        <label className="block mb-2 text-[15px] mt-2">
          Min Salary:
          <div className="flex items-center mt-2">
            <Slider
              min={0}
              defaultValue={[0]}
              max={100}
              step={1}
              onValueChange={(e) => {
                handleSalaryChange(e[0])
              }}
              className={cn("w-[100%]")}
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
          <div className="btn-container flex items-center gap-5 mt-2">
            <button
              className="submit-btn rounded-full px-4 py-2 text-[white] hover:bg-green-600 bg-green-500   text-[15px] font-medium	flex items-center justify-center gap-2"
              onClick={handleSubmit}
            >
              Apply
              <ArrowRight size={15} />
            </button>
            <button
              className="submit-btn rounded-full px-4 py-2 text-[white] hover:bg-red-500 bg-red-400/90   text-[15px]  font-medium	flex items-center justify-center gap-2"
              onClick={clearFilters}
            >
              Clear
              <Trash size={15} />
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export default FilterForm;
