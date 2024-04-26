
import { JobSeeker, Organization } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { appendToBaseUrl } from "./hooks";
import { useSession } from "next-auth/react";
import { useFilterStore } from "@/store/filterStore";

export const useFetchAllOrganizations = (component?:string) => {
  const {filters}=useFilterStore()

  const fetchAllOrganizations = async (): Promise<Organization[]> => {
    const response = await axios.get(
      `/api/user/organization${filters.search?`?search=${filters.search}`:''}`
    );
    return response.data.organizations;
  };

  return useQuery({queryKey:[component?component:"all-organizations"],queryFn: fetchAllOrganizations});
};


export const useFetchSingleOrganization = (username:string) => {
  const fetchSingleOrganization = async (): Promise<Organization> => {
    const response = await axios.get(
      `/api/user/organization/${username}`
    );
    return response.data.organization;
  };

  return useQuery({queryKey:[`organization-${username}`],queryFn: fetchSingleOrganization});
};


export const useFetchApplicantsForJob = ({jobId,status}:{jobId:number,status:string}) => {
  const{data:authData}=useSession()
  async function fetchApplicantsForJob() {
    try{
    const response = await axios.get(
      appendToBaseUrl(`jobs/applicants/${jobId}/${status}`)
    );

    return response.data.jobseekers as JobSeeker[];
  }
  catch(e){
    console.log(e)
  }
  }
  return useQuery({
    queryKey: ["jobsseeker-applicants", authData?.user.id?authData?.user.id:"",jobId,status],
    queryFn: fetchApplicantsForJob,
  });
};

export const useGetLoggedInOrganization = () => {
  const { data: authData } = useSession();
  const getMe = async () => {
    return (await axios.get(appendToBaseUrl(`user/profile/organization`))).data
      .user as Organization;
  };
  return useQuery({
    queryKey: ["me",'organzation'],
    queryFn: getMe,
  });
};
