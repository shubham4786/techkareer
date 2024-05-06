"use client";
import { BottomBar, JobseekerList, Navbar } from "@/components/components";
import SearchSectionWrapper from "@/components/ui/SearchSectionWrapper";
import { useFilterStore } from "@/store/filterStore";
import React, { ChangeEvent, useEffect } from "react";

function JobseekerListPage() {
  const { filters, setFilter } = useFilterStore();
  useEffect(() => {
    return () => {
      setFilter({
        search: "",
        min_requiredExperience: 0,
        min_salary: 0,
        location: "",
        sort: "",
      });
    };
  }, []);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter({
      ...filters,
      search:value
    })

  }
    return (
    <>
      <Navbar>Users</Navbar>
      <SearchSectionWrapper>
        <input
          type="text"
          placeholder="Search"
          className="search-box"
          value={filters.search}
          onChange={handleInputChange}
        />
      </SearchSectionWrapper>
      <JobseekerList/>
      <BottomBar/>

    </>
  );
}

export default JobseekerListPage;
