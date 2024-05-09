'use client'
import { BottomBar, Navbar } from "@/components/components";
import JobseekerDetails from "@/components/JobSeekerDetailNew/JobSeekerDetailNew";
import { useFetchSingleJobseekers } from "@/hooks/useJobseekerData";
import React from "react";

function JobseekerDetailsPage({ params }: { params: { id: string }}) {
  const { data: jobseeker, isLoading } = useFetchSingleJobseekers(params.id);
  return (
    <>
      <Navbar>@{params.id}</Navbar>
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
        {jobseeker && <JobseekerDetails jobseeker={jobseeker} isLoading={isLoading}></JobseekerDetails>}
      </div>
      <BottomBar></BottomBar>
    </>
  );
}

export default JobseekerDetailsPage;
