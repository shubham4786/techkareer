"use client";
import { Application, JobProfile, Opportunity } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { appendToBaseUrl } from "./hooks";
import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";

export const useFetchAllOpportunities = (component?: string) => {
  const { filters } = useFilterStore();
  const fetchAllOpportunities = async (): Promise<Opportunity[]> => {
    const response = await axios.get(`/api/techkareer/opportunities`);
    return response.data.opportunities;
  };

  return useQuery({
    queryKey: [component ? component : "all-opportunities"],
    queryFn: fetchAllOpportunities,
  });
};
export const useFetchSingleOpportunity = (id: string) => {
  const fetchSingleOpportunity = async (): Promise<Opportunity> => {
    const response = await axios.get(`/api/jobs/job/${id}`);
    return response.data.opportunity;
  };

  return useQuery({
    queryKey: [`opportunity-${id}`],
    queryFn: fetchSingleOpportunity,
  });
};

export const useFetchAllJobs = () => {
  const { filters } = useFilterStore();
  const fetchAllJobs = async (): Promise<JobProfile[]> => {
    const response = await axios.get(
      `/api/jobs?${filters.search ? `search=${filters.search}` : ""}${
        filters.location ? `&location=${filters.location}` : ""
      }${
        filters.min_requiredExperience
          ? `&max_requiredExperience=${filters.min_requiredExperience}`
          : ""
      }${filters.min_salary ? `&min_salary=${filters.min_salary}` : ""}
      ${filters.sort ? `&sort=${filters.sort}` : ""}`
    );
    return response.data.jobProfile;
  };

  return useQuery({ queryKey: ["all-jobs"], queryFn: fetchAllJobs });
};

export const useFetchSingleJob = (id: string) => {
  const fetchSingleJob = async (): Promise<JobProfile> => {
    const response = await axios.get(`/api/jobs/${id}`);
    return response.data.job;
  };

  return useQuery({ queryKey: [`job-${id}`], queryFn: fetchSingleJob });
};

export const useFetchStatusOfApplication = (id: number) => {
  const { data: authData } = useSession();
  const fetchStatusOfApplication = async () => {
    const response = await axios.get(`/api/jobs/getstatus/${id}`);
    return response.data.application;
  };
  return useQuery({
    queryKey: ["job-status", authData?.user.id, id],
    queryFn: fetchStatusOfApplication,
  });
};

export const useApplyJob = (jobId: number) => {
  const { data: authData } = useSession();
  const applyJob = async () => {
    try {
      await axios.post(appendToBaseUrl(`jobs/apply/${jobId}`));
    } catch (error) {
      if (isAxiosError(error) && error.response?.status != 500) {
        toast.error(error.response?.data.error);
        throw Error(error.response?.data.error);
      } else {
        toast.error("Internal Server Eror");
        throw Error("Internal Server Eror");
      }
    }
  };
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyJob,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async () => {
      // await queryClient.refetchQueries({queryKey:["job-status",authData?.user.id, jobId]})
      // await queryClient.invalidateQueries({queryKey:["job-status",authData?.user.id, jobId]})
      await queryClient.invalidateQueries({
        queryKey: ["job-status", authData?.user.id, jobId],
      });
      // await queryClient.refetchQueries({queryKey:["job-status",authData?.user.id, jobId]})
      toast.success(`Successfull Applied`);
    },
  });
};

export const useFetchJobsWithApplicationStatus = (status: string) => {
  const { data: authData } = useSession();
  async function fetchJobsWithApplicationStatus() {
    const response = await axios.get(
      appendToBaseUrl(`jobs/jobseeker/${status}`)
    );
    return response.data.jobs as JobProfile[];
  }
  return useQuery({
    queryKey: ["jobs-application-status", authData?.user.id, status],
    queryFn: fetchJobsWithApplicationStatus,
  });
};

export const useFetchJobsPostedByOrganzations = () => {
  const { data: authData } = useSession();
  async function fetchJobsPostedByOrganzations() {
    try {
      const response = await axios.get(
        appendToBaseUrl(`jobs/organization/${authData?.user.id}`)
      );
      return response.data.organizationJobs as JobProfile[];
    } catch (e) {
      console.log(e);
    }
  }
  return useQuery({
    queryKey: ["jobs-organizations", authData?.user.id],
    queryFn: fetchJobsPostedByOrganzations,
  });
};

export const useHandleSeekerApplication = () => {
  const { data: authData } = useSession();
  const [status, setStatus] = useState("");
  const [application, setApplication] = useState({} as Application);
  const handleSeekerApplication = async ({
    applicationData,
    status,
  }: {
    applicationData: Application;
    status: string;
  }) => {
    setStatus(status);
    setApplication(applicationData);
    try {
      await axios.put(
        appendToBaseUrl(
          `jobs/applicants/handlestatus/${applicationData.id}/${status}`
        )
      );
    } catch (error) {
      if (isAxiosError(error) && error.response?.status != 500) {
        toast.error(error.response?.data.error);
        throw Error(error.response?.data.error);
      } else {
        toast.error("Internal Server Eror");
        throw Error("Internal Server Eror");
      }
    }
  };
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleSeekerApplication,

    onError: (error) => {},
    onSuccess: async () => {
      // await queryClient.refetchQueries({queryKey:["job-status",authData?.user.id, jobId]})
      // await queryClient.invalidateQueries({queryKey:["job-status",authData?.user.id, jobId]})

      // await queryClient.refetchQueries({queryKey:["job-status",authData?.user.id, jobId]})
      await queryClient.invalidateQueries({
        queryKey: [
          "jobsseeker-applicants",
          authData?.user.id ? authData?.user.id : "",
          application.jobProfileId.toString(),
          "applied",
        ],
      });
      await queryClient.invalidateQueries({
        queryKey: [
          "jobsseeker-applicants",
          authData?.user.id ? authData?.user.id : "",
          application.jobProfileId.toString(),
          "pending",
        ],
      });
      toast.success(`Successfull Applied`);
    },
  });
};
