"use client";
import BountiesList from "@/components/Bounty/BountiesList";
import { BottomBar, Navbar } from "@/components/components";
import SearchSectionWrapper from "@/components/ui/SearchSectionWrapper";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store/filterStore";
import React, { ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
const Bounties = () => {
  const router = useRouter();
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
      search: value,
    });
  };
  return (
    <div className="flex flex-col">
      <Navbar className="text-xl mt-3 md:text-2xl md:pl-8">
        <p>Bounties</p>
        <Button
          className="mr-8 bg-gray-200 text-black  rounded-xl hover:bg-gray-200 hover:text-black"
          onClick={() => {
            router.push("/bounties/create");
          }}
        >
          Create Bounty
        </Button>
      </Navbar>

      <SearchSectionWrapper>
        <input
          type="text"
          placeholder="Search for Bounties"
          className="bg-transparent px-6 outline-none"
          value={filters.search}
          onChange={handleInputChange}
        />
      </SearchSectionWrapper>
      <BountiesList />
      <BottomBar />
    </div>
  );
};

export default Bounties;
