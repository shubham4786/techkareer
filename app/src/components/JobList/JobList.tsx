"use client";
import { useFetchAllJobs, useFetchAllOpportunities } from "@/hooks/useJobData";
import React, { useEffect } from "react";
import { JobCard } from "../components";
import { JobProfile, Opportunity } from "@/types/type";
import { useFilterStore } from "@/store/filterStore";
import Loader from "../ui/Loader";

function JobList() {
  const { data: jobs, isLoading, refetch } = useFetchAllOpportunities('opportunities');
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
          <div className="flex  items-center justify-center  h-full w-full overflow-x-none overflow-y-auto">
            <Loader size="30px"></Loader>
          </div>
        </>
      ) : (
        jobs && (
          <>
            <div className="max-xl:block max-sm:h-[73vh] max-h-[83vh] flex gap-[18px] flex-wrap justify-center  w-full overflow-x-hidden overflow-y-auto px-3 py-5 max-xl:py-[0px]">
              {jobs.map((job: Opportunity) => (
                <JobCard key={job.id} job={job}></JobCard>
              ))}
            </div>
          </>
        )
      )}
    </>
  );
}

export default JobList;
