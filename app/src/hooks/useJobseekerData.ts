import { JobSeeker } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { appendToBaseUrl } from "./hooks";
import { useFilterStore } from "@/store/filterStore";

export const useFetchAllJobseekers = (component?:string) => {
  const { filters } = useFilterStore();
  const fetchAllJobseekers = async (): Promise<JobSeeker[]> => {
    const response = await axios.get(
      `/api/user/jobseeker${filters.search ? `?search=${filters.search}` : ""}`
    );
    return response.data.jobseekers;
  };

  return useQuery({
    queryKey: [component?component:"all-jobseekers"],
    queryFn: fetchAllJobseekers,
  });
};

export const useFetchSingleJobseekers = (username: string) => {
  const fetchSingleJobseekers = async (): Promise<JobSeeker> => {
    const response = await axios.get(`/api/user/jobseeker/${username}`);
    return response.data.jobseeker;
  };

  return useQuery({
    queryKey: [`jobseeker-${username}`],
    queryFn: fetchSingleJobseekers,
  });
};

export const useGetLoggedInUser = () => {
  const { data: authData } = useSession();
  const getMe = async () => {
    return (await axios.get(appendToBaseUrl(`user/profile/jobseeker`))).data
      .user as JobSeeker;
  };
  return useQuery({
    queryKey: ["me", authData?.user.username],
    queryFn: getMe,
  });
};
