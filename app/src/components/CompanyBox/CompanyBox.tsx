'use client'
import { organizationPlaceHolder } from "@/assets/assets";
import { Organization } from "@/types/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function CompanyBox({ organization }: { organization: Organization }) {
  const router=useRouter()
  return (
    <>
      <div onClick={()=>{
        router.push(`/companies/${organization.username}`)
      }} className="max-xl:my-[15px]  max-xl:w-[100%] w-[45%] h-[11rem] border border-[#E1E4E8] py-[10px] px-[5px] rounded-lg  cursor-pointer flex flex-col  ps-3">
        <div className="profile-pic  flex flex-between items-center h-[3rem] w-[3rem] mt-2 overflow-hidden border-[1px] rounded-full">
          {organization.profilePic ? (
            <img
              className=" object-fill  h-full w-full"
              src={organization.profilePic}
            ></img>
          ) : (
            <Image
              className=" object-fill  h-full w-full"
              alt=""
              src={organizationPlaceHolder}
            />
          )}
        </div>
        <div className="org-username text-[14px] mt-1">
          {organization.name} @{organization.username}
        </div>
        <div className="org-desc text-[13px] mt-1 color-lgt-grey">
          {organization.location}
        </div>

        <div className=" color-lgt-grey text-three-line w-full text-[11px] pe-4 text-three-line mt-1">
          {organization.overview}
        </div>
      </div>
    </>
  );
}

export default CompanyBox;
