"use client";
import { useFetchAllOrganizations } from "@/hooks/useOrganizationData";
import React, { useEffect } from "react";
import { CompanyBox } from "../components";
import { useFilterStore } from "@/store/filterStore";
import Loader from "../ui/Loader";

function CompanyList() {
  const {
    data: organizations,
    isLoading,
    refetch,
  } = useFetchAllOrganizations();
  const { filters } = useFilterStore();
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timeoutID);
  }, [filters.search]);
  return (
    <>
      {isLoading ? (
        <>
          <div className="  max-sm:h-[73vh] h-[83vh] flex items-center  justify-center  w-full ">
            <Loader size="30px"></Loader>
          </div>
        </>
      ) : (
        organizations && (
          <div className="max-xl:block  max-sm:h-[73vh] max-h-[83vh] flex gap-[20px]  flex-wrap items-start justify-center  w-full overflow-x-hidden overflow-y-auto px-3 py-5 max-xl:py-[0px]">
            <>
              {" "}
              {organizations.map((organization) => (
                <CompanyBox
                  key={organization.id}
                  organization={organization}
                ></CompanyBox>
              ))}
            </>
          </div>
        )
      )}
    </>
  );
}

export default CompanyList;
