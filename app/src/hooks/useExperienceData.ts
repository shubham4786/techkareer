import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { Experience } from "@/types/type";
import { appendToBaseUrl } from "./hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useFetchExperienceByUser = (userId: string|undefined) => {
  const fetchExperienceByUser = async () => {
    const response = await axios.get(
        appendToBaseUrl(`user/experience/jobseeker/${userId}`)
    );
    return response.data.experiences as Experience[];
  };
  return useQuery({queryKey:[userId, "Experience"],enabled:!!userId,queryFn: fetchExperienceByUser});
};

export const useAddExperience = () => {
  const { data:auth } = useSession();
  const addExperience = (data: {
    role: string;
    company: string;
    startMonth: string;
    startYear: string;
    endMonth?: string;
    endYear?: string;
  }) => {
    if (data.endMonth?.length === 0) {
      delete data.endMonth;
    }
    if (data.endYear?.length === 0) {
      delete data.endYear;
    }
    const postData = { ...data };
    return axios.post(appendToBaseUrl('user/experience/'), postData);
  };
  const queryClient = useQueryClient();

  return useMutation({mutationFn:addExperience, 
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[auth?.user.id.toString(), "Experience"]});
      toast.success("Experience Added!");
    },
  });
};

export const useDeleteExperience = () => {
  const { data:auth} = useSession();
  const deleteExperience = (id: string) => {
    return axios.delete(appendToBaseUrl(`user/experience/${id}`));
  };
  const queryClient = useQueryClient();

  return useMutation({mutationFn:deleteExperience, 
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[auth?.user.id.toString(), "Experience"]});
      toast.success("Experience Deleted!");
    
  }});
};

export const useUpdateExperience = () => {
  const { data:auth} = useSession();
  const updateExperience = (data: {
    id:string,
    role: string;
    company: string;
    startMonth: string;
    startYear: string;
    endMonth?: string|null;
    endYear?: string|null;
  }) => {
  
    if (data.endMonth?.length === 0) {
        data.endMonth=null;
      }
      if (data.endYear?.length === 0) {
        data.endYear=null;
      }
    return axios.put(appendToBaseUrl(`user/experience/${data.id}`), {...data,startYear:parseInt(data.startYear),endYear:data.endYear?parseInt(data.endYear):null});
    
};
  const queryClient = useQueryClient();

  return useMutation({mutationFn:updateExperience,
    onError:()=>{}, 
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[auth?.user.id.toString(), "Experience"]});
      toast.success("Experience Updated!");

  }});
};