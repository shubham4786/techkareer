"use client";
import { useFetchConnections } from "@/hooks/useConnectionData";
import React from "react";
import { JobseekerBox } from "../components";
import { JobSeeker, User } from "@/types/type";
import Loader from "../ui/Loader";

function ConnectionsList({ status }: { status: string }) {
  const { data: connections,isLoading } = useFetchConnections({ status });
  return (
    <>
      {isLoading?
      <div className="flex max-sm:h-[80vh] h-[90vh] w-full items-center justify-center">
        <Loader size='30px'></Loader>
      </div>
      :
      <div className="max-xl:block max-sm:h-[80vh] max-h-[90vh] flex gap-[18px] flex-wrap justify-center  w-full overflow-x-hidden overflow-y-auto px-3 py-5 max-xl:py-[0px]">
        {connections &&
          connections.map((seeker: any) => (
            <JobseekerBox
              key={seeker.id}
              connectionStatus={status}
              jobseeker={seeker}
            ></JobseekerBox>
          ))}
      </div>}
    </>
  );
}

export default ConnectionsList;
