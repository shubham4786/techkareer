"use client";
import { organizationPlaceHolder } from "@/assets/assets";
import { useFetchAllOrganizations } from "@/hooks/useOrganizationData";
import { Organization } from "@/types/type";
import { shuffle } from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

function RightBarOrganizationList() {
  const router = useRouter();
  const { data: authData } = useSession();
  const [org, setOrg] = useState<Organization[]>();
  const { data: organizations } = useFetchAllOrganizations("org-for-section");
  useEffect(() => {
    if (organizations && organizations.length > 0) {
      setOrg(() => shuffle([...organizations]));
    }
  }, [organizations]);
  return (
    <>
      <div className="people-rec-section  w-full flex flex-col mt-6 ">
        <div
          onClick={() => router.push("/companies")}
          className="text-holder cursor-pointer flex justify-between items-center text-[14px] font-medium ms-3 me-3"
        >
          Organizations on Techkareer
          <FaArrowRightLong />
        </div>
        <div className="user-desc flex flex-col gap-[2px] w-full ps-2 pe-2 mt-1 ps-3">
          {org ? (
            org
              .filter((jobseeker) => {
                if (authData && authData.user.username == jobseeker.username) {
                  return false;
                }
                return true;
              })
              .slice(0, 3)

              .map((org: Organization) => {
                return (
                  <div
                    key={org.id}
                    onClick={() => router.push(`/companies/${org.username}`)}
                  >
                   <div className="profile-pic-follow  mt-1 flex  py-3 items-center w-full  hover:bg-gray-200/20 rounded-xl transition-all px-1 cursor-pointer gap-3">
                      <div className="profile-pic w-[18%] flex flex-between justify-center items-center  mt-2 overflow-hidden rounded-full">
                        {org.profilePic ? (
                          <Image
                            className="  h-full w-full"
                            alt=""
                            width={80}
                            height={80}
                            src={`${org.profilePic}`}
                          ></Image>
                        ) : (
                          <Image
                            src={organizationPlaceHolder}
                            alt=""
                            width={80}
                            height={80}
                            className=" object-contain  h-full w-full"
                          ></Image>
                        )}
                      </div>
                      <div className="flex-col w-[90%]">
                        <div className="people-username text-[13px]">
                          {org.name}
                        </div>

                        <div className="people-desc truncate color-lgt-grey w-full text-[13px] text-wrap mt-1">
                          {org.overview}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default RightBarOrganizationList;
