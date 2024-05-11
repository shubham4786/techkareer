"use client";
import { BottomBar, JobDetails, Navbar } from "@/components/components";
import { useFetchSingleJob, useFetchSingleOpportunity } from "@/hooks/useJobData";
import React from "react";
import { MoveRight } from "lucide-react";

function JobDetailsPage({ params }: { params: { jobId: string } }) {
  const { data: job, isLoading } = useFetchSingleOpportunity(
    params.jobId
  );
  return (
    <>
      {isLoading ? (<>
        <Navbar>{"Loading"}</Navbar>{" "}</>
      ) : (
        job && (
          <>
            <Navbar className="flex justify-start items-center gap-3">
              <p> {job.role} at {job.companyName}</p>
             <MoveRight />
            </Navbar>{" "}
            <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] ">
              <JobDetails job={job}></JobDetails>
            </div>
            <BottomBar></BottomBar>

          </>
        )
      )}
    </>
  );
}

export default JobDetailsPage;
