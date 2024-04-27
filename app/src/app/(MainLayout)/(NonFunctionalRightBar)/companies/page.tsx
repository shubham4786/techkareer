'use client'
import {  BottomBar, CompanyList, Navbar } from "@/components/components";
import { SearchSectionWrapper } from "@/components/ui/ui";
import { useFilterStore } from "@/store/filterStore";
import React, { ChangeEvent, useEffect } from "react";

function CompaniesPage() {
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
      <Navbar>Companies</Navbar>
      <SearchSectionWrapper>
        <input
          type="text"
          placeholder="Search"
          className="search-box"
          value={filters.search}
          onChange={handleInputChange}
          // onChange={handleSearchInput}
          // onKeyDown={handleEnter}
        />
      </SearchSectionWrapper>
      <CompanyList></CompanyList>
      <BottomBar></BottomBar>

    </>
  );
}

export default CompaniesPage;
