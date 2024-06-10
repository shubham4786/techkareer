"use client";
import { getNameFromEmail } from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { HiOutlineUser } from "react-icons/hi2";

function Rightbar({ children }: { children: ReactNode }) {
  const { data: auth, status } = useSession();
  const router=useRouter()
  return (
    <>
      <div className="fav-section max-md:hidden w-[20%] h-[100vh]  ">
        <div className="top-section  flex justify-between  items-center px-5 gap-5  h-[10vh] max-h-[10vh]">
        {status == "authenticated" && auth && (
          <div className=" cursor-pointer flex items-center text-[14px]">


                <div onClick={()=>router.push(`/profile/${auth.user.role.toLowerCase()}`)} className="flex items-center justify-center gap-3 relative">
                  <div className="profile-pic-container h-[30px] min-w-[30px] relative flex items-center justify-center">
                    {auth.user?.image ? (
                      <Image
                        alt=""
                        fill
                        className="rounded-full object-fill"
                        src={auth.user?.image}
                      ></Image>
                    ) : (
                      <HiOutlineUser className=" cursor-pointer text-[19px] " />
                    )}
                  </div>
             <span className="text-xl"> { auth.user.name ? auth.user.name: getNameFromEmail(auth.user.email)}</span>    
                </div>
  

          </div>
        )}
        </div>
        {children}
      </div>
    </>
  );
}

export default Rightbar;
