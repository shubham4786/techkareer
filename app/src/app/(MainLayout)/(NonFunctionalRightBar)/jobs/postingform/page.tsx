'use client'
import { WithAuthOrg } from "@/components/HOC/withAuthOrg";
import { BottomBar, JobPostingForm, Navbar } from "@/components/components";
import React from "react";

function JobPostingFormPage() {
  return (
    <>
      <Navbar>Post a Job</Navbar>
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex  justify-center">
        <JobPostingForm></JobPostingForm>
      </div>
      <BottomBar></BottomBar>
    </>
  );
}

export default WithAuthOrg(JobPostingFormPage);
