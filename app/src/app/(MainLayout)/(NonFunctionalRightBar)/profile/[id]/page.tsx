"use client";

import { WithAuthSeeker } from "@/components/HOC/withAuthSeeker";
import JobseekerProfile from "@/components/JobseekerProfile/JobseekerProfile";
import { BottomBar, Navbar } from "@/components/components";
import { getNameFromEmail } from "@/utils/utils";
import { useSession } from "next-auth/react";
import React from "react"

import placeholder from '@/assets/placholder-jobseeker.webp'
import Image from "next/image";
import { useUserInfo } from "@/hooks/useUser";
import { ArrowRight, ChevronRight, Loader } from "lucide-react";
function JobseekerProfilePage() {
  const { data: auth, status } = useSession();
  if(!auth){
    return <></>
  }
  return (
    <>
    <Navbar className="justify-start gap-5" >{ auth?.user.name ? auth.user.name : getNameFromEmail(auth?.user.email || "")}
    
    <ChevronRight className="text-gray-500"/> 
    
    </Navbar>
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
        <ProfileCard user={auth.user}/>
      </div>
      <BottomBar></BottomBar>

    </>
  );
}




const ProfileCard = ({user}:{
    user:any
})=>{

  const {user:userInfo , loading , error} = useUserInfo(user.id)
  if(loading){
    return <Loader className="animate-spin"/>
  }
return (
    <div className=" w-full h-fit flex flex-col justify-center items-center">
      <div>
      {
        userInfo?.profilePic ?
        <Image 
        src={userInfo.profilePic}
        width={200}
        height={200}
        alt=""
        />:
        <Image 
        src={placeholder}
        width={200}
        height={200}
        alt=""
        />
      }
      </div>
      <div>
        <h1>{userInfo?.name}</h1>
        <h2>{userInfo?.email}</h2>
      </div>
    </div>
)
}
export default WithAuthSeeker(JobseekerProfilePage);
