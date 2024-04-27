'use client'
import { WithAuthOrg } from "@/components/HOC/withAuthOrg";


import OrganizationProfileEdit from "@/components/OrganizationProfileEdit/OrganizationProfileEdit";
import { BottomBar, Navbar } from "@/components/components";
import React from "react";

function OrganizationProfileEditPage() {
  return (
    <>
      <Navbar>Edit Profile</Navbar>
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
        <OrganizationProfileEdit></OrganizationProfileEdit>
      </div>
      <BottomBar></BottomBar>

    </>
  );
}

export default WithAuthOrg(OrganizationProfileEditPage);
