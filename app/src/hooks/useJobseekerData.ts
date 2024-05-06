import { JobSeeker, User } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { appendToBaseUrl } from "./hooks";
import { useFilterStore } from "@/store/filterStore";

export const useFetchAllJobseekers = (component?:string) => {
  const { filters } = useFilterStore();
  const fetchAllJobseekers = async (): Promise<User[]> => {
    const response = await axios.get(
      `/api/techkareer/users`
    );
    return response.data.users 
  };

  return useQuery({
    queryKey: [component?component:"all-jobseekers"],
    queryFn: fetchAllJobseekers,
  });
};

export const useFetchSingleJobseekers = (id: string) => {
  const fetchSingleJobseekers = async (): Promise<User> => {
    const response = await axios.get(`/api/user/jobseeker/${id}`);
    return response.data.jobseeker;
  };

  return useQuery({
    queryKey: [`jobseeker-${id}`],
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
