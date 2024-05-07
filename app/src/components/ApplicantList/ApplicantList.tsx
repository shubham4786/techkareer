"use client";
import { useFetchApplicantsForJob } from "@/hooks/useOrganizationData";
import React from "react";
import { JobseekerBox } from "../components";
import Loader from "../ui/Loader";

function ApplicantList({ jobId, status }: { jobId: number; status: string }) {
  const { data: seekers, isLoading } = useFetchApplicantsForJob({
    jobId,
    status,
  });
  return (
    <>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center  ">
          <Loader size="30px"></Loader>
        </div>
      ) : (
        <div className="max-xl:block max-sm:h-[80vh] max-h-[90vh] flex gap-[18px] flex-wrap justify-center  w-full overflow-x-hidden overflow-y-auto px-3 py-5 max-xl:py-[0px]">
          {seekers &&
            seekers.map((seeker:any) => (
              <JobseekerBox
                key={seeker.id}
                status={seeker.jobApplications[0].status}
                jobseeker={seeker}
              ></JobseekerBox>
            ))}
        </div>
      )}
    </>
  );
}

export default ApplicantList;
