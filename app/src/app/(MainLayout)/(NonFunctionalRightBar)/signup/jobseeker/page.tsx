'use client'
import { WithoutAuth } from "@/components/HOC/withOutAuth";
import { BottomBar, JobseekerRegistrationForm, Navbar } from "@/components/components";
import React from "react";

function Signup() {
  return (
    <>
      <Navbar>Jobseeker Registration</Navbar>
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex  justify-center">
        <JobseekerRegistrationForm></JobseekerRegistrationForm>
      </div>
      <BottomBar/>
    </>
  );
}

export default WithoutAuth(Signup);
