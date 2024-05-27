"use client";

import { WithAuthSeeker } from "@/components/HOC/withAuthSeeker";
import JobseekerProfile from "@/components/JobseekerProfile/JobseekerProfile";
import { BottomBar, Navbar } from "@/components/components";
import { useSession } from "next-auth/react";
import React from "react";

function JobseekerProfilePage() {
  const { data: auth } = useSession();

  return (
    <>

      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
        {/* <CompanyDetails username={auth?.user.username}></CompanyDetails> */}
        <JobseekerProfile></JobseekerProfile>
      </div>
      <BottomBar></BottomBar>

    </>
  );
}

export default WithAuthSeeker(JobseekerProfilePage);
