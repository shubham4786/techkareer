import { BottomBar, Navbar } from "@/components/components";
import JobseekerDetails from "@/components/JobSeekerDetailNew/JobSeekerDetailNew";
import React from "react";

function JobseekerDetailsPage({ params }: { params: { id: string }}) {

  return (
    <>
      <Navbar>@{params.id}</Navbar>
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
      <JobseekerDetails id={params.id}></JobseekerDetails>
      </div>
      <BottomBar></BottomBar>

    </>
  );
}

export default JobseekerDetailsPage;
