"use client";
import {
  BottomBar,
  FilterForm,
  JobList,
  Navbar,
} from "@/components/components";
import SearchSectionWrapper from "@/components/ui/SearchSectionWrapper";
import { useFetchAllJobs } from "@/hooks/useJobData";
import { useFilterStore } from "@/store/filterStore";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { AiFillFilter } from "react-icons/ai";
import { FaSort } from "react-icons/fa6";
import { IoCloseCircleSharp } from "react-icons/io5";
interface statusType {
  name: string;
  value: string;
}
function JobListPage() {

  const { filters, setFilter } = useFilterStore();
  const { refetch } = useFetchAllJobs();
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<statusType>({
    name: "Recently Latest",
    value: "",
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const closeDropdown = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
      setFilter({
        search: "",
        min_requiredExperience: 0,
        min_salary: 0,
        location: "",
        sort: "",
      });
    };
  }, []);
  useEffect(() => {
    setFilter({
      ...filters,
      sort: status.value,
    });

    let interval = setTimeout(() => refetch(), 100);
    return () => {
      clearInterval(interval);
    };
  }, [status]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter({
      ...filters,
      search: value,
    });
  };
  return (
    <div className="flex flex-col">
      <Navbar>
        Jobs
        <div className="relative flex gap-1 ">
          <div
            ref={dropdownRef}
            className="border-[2px] max-md:flex hidden cursor-pointer px-2 py-1 rounded-full btn-container flex items-center gap-1 cursor-pointer"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <div className="text text-[14px]">Filter</div>
            <AiFillFilter className="text-[16px]" />
          </div>
          <div
            ref={dropdownRef}
            className="border-[2px] cursor-pointer px-2 py-1 rounded-full btn-container flex items-center gap-1 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="text text-[14px]">{status.name}</div>
            <FaSort className="text-[16px]" />
          </div>
          {isOpen && (
            <div
              className="absolute cursor-pointer text-[14px] right-[-1rem] z-[10rem] mt-3 w-60   origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                {[
                  { name: "Recently Latest", value: "" },
                  { name: "Salary Low-High", value: "salary" },
                  { name: "Salary High-Low", value: "-salary" },
                ].map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setStatus(item);
                    }}
                    className="text-gray-700 font-700   px-2 py-2 text-[14px]"
                    role="menuitem"
                    id="menu-item-0"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Navbar>
      <SearchSectionWrapper>
        <input
          type="text"
          placeholder="Search for Jobs"
          className="bg-transparent px-6 outline-none"
          value={filters.search}
          onChange={handleInputChange}
        />
      </SearchSectionWrapper>
      <div className="scrollable-content-wrapper max-sm:h-[73vh] h-[83vh] w-full ">
        <JobList />
      </div>
      <BottomBar></BottomBar>
      {modalOpen && (
        <>
          <div className=" backdrop h-[100vh] w-[100vw] fixed top-0 left-0  bg-gray-500 opacity-30 z-100  flex items-center justify-center "></div>

          <div className=" modal-content absolute z-500 h-[100vh] w-[100vw] top-0 left-0   flex items-center justify-center">
            <div className="bg-white rounded-[10px] h-[max-content] w-[max-content] flex flex-col px-2 py-2">
              <div className="close-btn w-full flex justify-end ">
                <IoCloseCircleSharp
                  onClick={() => setModalOpen(false)}
                  className="text-[20px] cursor-pointer"
                />
              </div>
              <FilterForm></FilterForm>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default (JobListPage);
