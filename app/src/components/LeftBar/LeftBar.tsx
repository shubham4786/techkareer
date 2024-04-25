"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { FaEnvelopeCircleCheck } from "react-icons/fa6";
import { HiOutlineBuildingOffice, HiOutlineUser } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { IoPeopleOutline } from "react-icons/io5";
import { PiHandshake, PiSuitcaseSimpleDuotone } from "react-icons/pi";

function Leftbar() {
  const router = useRouter()
  const { data: authUser, status } = useSession();

  return (
    <>
      <>
        <div className="side-section  max-sm:hidden w-[20%] h-[100vh] border-l-[1px] border-l-[solid] border-l-[#E1E4E8]">
          <div className="logo-container flex h-[7rem] w-full items-center justify-center ">
            <div className="text-wrapper font-900 text-[16px]">Techkareer</div>
          </div>
          <div className=" cursor-pointer flex flex-col w-full">

            {!authUser || (authUser.user.role == 'Jobseeker') ?
              <div onClick={() => router.push(`/jobslist`)} className="hover:bg-green-500 hover:text-white cursor-pointer  border-solid border-[1px] border-green-500 flex items-center gap-[3px] text-[16px]  font-medium	px-[3px] py-2 m-1">
                <PiSuitcaseSimpleDuotone className=" cursor-pointer text-[19px] "></PiSuitcaseSimpleDuotone>
                Jobs
              </div> :
              <div onClick={() => router.push(`/companies/postedjobs`)} className="hover:bg-green-500 hover:text-white cursor-pointer  border-solid border-[1px] border-green-500 flex items-center gap-[3px] text-[16px]  font-medium	px-[3px] py-2 m-1">
                <PiSuitcaseSimpleDuotone className=" cursor-pointer text-[19px]"></PiSuitcaseSimpleDuotone>
                PostedJobs
              </div>
            }
            <div onClick={() => router.push(`/jobseekers`)} className="hover:bg-green-500 hover:text-white cursor-pointer  border-solid border-[1px] border-green-500 flex items-center gap-[3px] text-[16px] font-medium px-[3px] py-2 m-1 ">
              <IoPeopleOutline className=" cursor-pointer text-[19px]"></IoPeopleOutline>
              People
            </div>
            <div onClick={() => router.push(`/companies`)} className="hover:bg-green-500 hover:text-white cursor-pointer  border-solid border-[1px] border-green-500 flex items-center gap-[3px] text-[16px] font-medium px-[3px] py-2 m-1">
              <HiOutlineBuildingOffice className=" cursor-pointer text-[19px]"></HiOutlineBuildingOffice>
              Companies
            </div>
            {(authUser && authUser.user.role == 'Jobseeker') && <div onClick={() => router.push(`/connections`)} className="hover:bg-green-500 hover:text-white cursor-pointer  border-solid border-[1px] border-green-500   flex items-center gap-[3px] text-[16px] font-medium px-[3px] py-2 m-1">
              <PiHandshake className=" cursor-pointer text-[19px] "></PiHandshake>
              Connects
            </div>}
            {(authUser && authUser?.user.role == "Organization") && (
              <div onClick={() => router.push(`/jobs/postingform`)} className="hover:bg-green-500 hover:text-white cursor-pointer  border-solid border-[1px] border-green-500   flex items-center gap-[3px] text-[16px] font-medium px-[3px] py-2 m-1">
                <AiOutlineAppstoreAdd className="nav-items-logo"></AiOutlineAppstoreAdd>
                Post Job
              </div>)}
            {(authUser && authUser?.user.role == "Jobseeker") && (
              <div onClick={() => router.push(`/jobs/applied`)} className="hover:bg-green-500 hover:text-white cursor-pointer  border-solid border-[1px] border-green-500   flex items-center gap-[3px] text-[16px] font-medium px-[3px] py-2 m-1">
                <FaEnvelopeCircleCheck className="nav-items-logo" />
                AppliedJobs
              </div>)}
            {status == 'loading' ?
              <></>
              : authUser ? (
                <>
                  <div onClick={() => router.push(`/profile/${authUser.user.role.toLowerCase()}`)} className="hover:bg-green-500 hover:text-white cursor-pointer  overflow-hidden border-solid border-[1px] border-green-500   flex items-center gap-[3px] text-[16px] font-medium px-[3px] py-2 m-1 	truncate">
                    <div className="profile-pic-container flex items-center justify-center  h-[20px] min-w-[20px] relative">
                      {authUser.user?.image ? (
                        <Image
                          alt=""
                          fill
                          className=" object-fill"
                          src={authUser.user?.image}
                        ></Image>
                      ) : (
                        <HiOutlineUser className=" cursor-pointer text-[19px] " />
                      )}
                    </div>
                    @{authUser.user.username}
                  </div>
                  <div onClick={() => signOut()} className="hover:bg-green-500 hover:text-white cursor-pointer  overflow-hidden border-solid border-[1px] border-green-500   flex items-center gap-[3px] text-[16px] font-medium px-[3px] py-2 m-1">
                    <IoIosLogOut className=" cursor-pointer text-[19px] " />
                    Logout
                  </div>
                </>
              ) : (
                <div onClick={() => router.push(`/signin`)} className="hover:bg-green-500 hover:text-white cursor-pointer  overflow-hidden border-solid border-[1px] border-green-500   flex items-center gap-[3px] text-[16px] font-medium px-[3px] py-2 m-1">
                  <HiOutlineUser className=" cursor-pointer text-[19px] " />
                  Login{" "}
                </div>
              )}
          </div>
        </div>
      </>
    </>
  );
}

export default Leftbar;
