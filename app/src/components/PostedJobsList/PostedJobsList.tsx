"use client";
import { useFetchJobsPostedByOrganzations } from "@/hooks/useJobData";
import React from "react";
import { JobCard } from "../components";
import Loader from "../ui/Loader";

function PostedJobsList() {
  const { data: jobs, isLoading } = useFetchJobsPostedByOrganzations();
  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader size="30px" />
        </div>
      ) : (
        <div className="flex flex-col  h-full w-full overflow-x-none overflow-y-auto">
          {/* {jobs &&
            jobs.map((job) => <JobCard job={job} key={job.id}></JobCard>)} */}
        </div>
      )}
    </>
  );
}

export default PostedJobsList;
