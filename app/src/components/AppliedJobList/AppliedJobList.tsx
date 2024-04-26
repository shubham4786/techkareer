import { useFetchJobsWithApplicationStatus } from "@/hooks/useJobData";
import React from "react";
import { JobCard } from "../components";
import Loader from "../ui/Loader";

function AppliedJobList({ status }: { status: string }) {
  const { data: jobs, isLoading } = useFetchJobsWithApplicationStatus(status);
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col  h-full w-full items-center justify-center">
          <Loader size="30px"></Loader>
        </div>
      ) : (
        <div className="flex flex-col  h-full w-full overflow-x-none overflow-y-auto">
          {jobs &&
            jobs.map((job) => (
              <JobCard
                job={job}
                key={job.id}
                status={job.applications && job.applications[0].status}
              ></JobCard>
            ))}
        </div>
      )}
    </>
  );
}

export default AppliedJobList;
