"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export const WithAuthSeeker = (Component: any) => {
  return function WithAuthSeeker(props: any) {
    const { data: authData, status } = useSession();
    useEffect(() => {
      
      if (status != "loading" && !authData) {
        redirect("/signin");
      } else if (
        status != "loading" &&
        authData &&
        authData.user.role &&
        authData.user.role === "Organization"
      ) {
        redirect("/profile/organization");
      }
    }, [status]);
    if (status == "loading" || status == 'unauthenticated') {
       return <></> ;
      }
      if(status=='authenticated'){
    return <Component {...props} />};
  };
};
