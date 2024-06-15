"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export const WithAuthOrg = (Component: any) => {
  return function WithAuthOrg(props: any) {
    const { data: authData, status } = useSession();
    useEffect(() => {
      if (status != "loading" && !authData) {
        redirect("/login");
      } else if (
        status != "loading" &&
        authData &&
        authData.user.role &&
        authData.user.role === "Jobseeker"
      ) {
        redirect("/profile/jobseeker");
      }
    }, [status]);
    if (status == "loading" || status == "unauthenticated") {
      return <></>;
    }
    if (status == "authenticated") {
      return <Component {...props} />;
    }
  };
};
