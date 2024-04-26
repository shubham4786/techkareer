'use client'
import { WithAuthSeeker } from "@/components/HOC/withAuthSeeker";
import JobseekerProfileEdit from "@/components/JobseekerProfileEdit/JobseekerProfileEdit";
import { BottomBar, Navbar } from "@/components/components";
import React from "react";

function JobseekerProfileEditPage() {
  return (
    <>
      <Navbar>Edit Profile</Navbar>
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
        <JobseekerProfileEdit/>
      </div>
      <BottomBar></BottomBar>

    </>
  );
}

export default WithAuthSeeker(JobseekerProfileEditPage);
