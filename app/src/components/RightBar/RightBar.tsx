"use client";
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
      <div className="fav-section max-md:hidden w-[20%] h-[100vh]  border-r-[1px] border-r-[solid] border-r-[#E1E4E8]">
        <div className="top-section  flex justify-between  items-center px-5 gap-5 border-b-[1px] border-b-[solid] border-b-[#E1E4E8] h-[10vh] max-h-[10vh]">
          <div className=" cursor-pointer flex items-center text-[14px]">
            {status == "authenticated" && auth ? (
              <>
                <div onClick={()=>router.push(`/profile/${auth.user.role.toLowerCase()}`)} className="flex items-center gap-[5px] relative">
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
                  {`@${auth.user.username}`}
                </div>
              </>
            ) : (
              <div onClick={()=>{router.push('/signin')}}>
              Login
          </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </>
  );
}

export default Rightbar;
