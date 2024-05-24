'use client'
import { BottomBar, Navbar } from "@/components/components";
import JobseekerDetails from "@/components/JobSeekerDetailNew/JobSeekerDetailNew";
import { useFetchSingleJobseekers } from "@/hooks/useJobseekerData";
import React from "react";
import {MoveRight } from "lucide-react";
function JobseekerDetailsPage({ params }: { params: { id: string }}) {
  const { data: jobseeker, isLoading } = useFetchSingleJobseekers(params.id);
  return (
    <>
    {
      jobseeker?.id && <Navbar>{jobseeker?.name ? <div className="flex justify-start items-center gap-4"><p>{jobseeker?.name} </p><MoveRight size={15}/> </div> : `Talent Id: ${jobseeker?.id}`}</Navbar>
    }
      
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
        {jobseeker && <JobseekerDetails jobseeker={jobseeker} isLoading={isLoading}></JobseekerDetails>}
      </div>
      <BottomBar></BottomBar>
    </>
  );
}

export default JobseekerDetailsPage;
