import { Project } from "@/types/type";
import axios from "axios";
import { appendToBaseUrl } from "./hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export const useFetchProjectByUser = (userId: string|undefined) => {
  const fetchProjectByUser = async () => {
    const response = await axios.get(appendToBaseUrl(`user/projects/jobseeker/${userId}`));
    return response.data.projects as Project[];
  };
  return useQuery({
    enabled:!!userId,
    queryKey: [userId, "Projects"],
    queryFn: fetchProjectByUser,
  });
};

export const useAddProject = () => {
  const { data: auth } = useSession();
  const addProject = (data: {
    name: string;
    deployedLink: string;
    description: string;
    techStack: string[];
    image: File | null;
  }) => {
    const formData = new FormData();

    // Append fields to the FormData object
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        if (value != null) {
          formData.append(key, value);
        }
      } else {
        if (value != null) {
          formData.append(key, value);
        }
      }
    }

    return axios.post(appendToBaseUrl("user/projects"), formData, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [auth?.user.id.toString(), "Projects"],
      });
      toast.success("Project Added!");
    },
  });
};

export const useDeleteProject = () => {
  const { data: auth } = useSession();
  const deleteProject = (id: string) => {
    return axios.delete(appendToBaseUrl(`user/projects/${id}`));
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [auth?.user.id.toString(), "Projects"],
      });
      toast.success("Project Deleted!");
    },
  });
};

export const useUpdateProject = () => {
  const { data: auth } = useSession();
  const updateProject = (data: {
    id: number;
    name: string;
    repoLink: string;
    deployedLink: string;
    description: string;
    techStack: string[];
  }) => {
    return axios.put(appendToBaseUrl(`user/projects/${data.id}`), data);
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [auth?.user.id.toString(), "Projects"],
      });
      toast.success("Project Updated!");
    },
  });
};

export const useEditProjectImage = () => {
  const { data: auth } = useSession();
  const addProject = (data: { id: number; image: File | null }) => {
    const formData = new FormData();
    if (data.image instanceof File) {
      if (data.image != null) {
        formData.append("image", data.image);
      }
    }
    // Append fields to the FormData object

    return axios.post(
      appendToBaseUrl(`user/projects/${data.id}/image`),
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data`,
        },
      }
    );
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [auth?.user.id.toString(), "Projects"],
      });
      toast.success("Project Added!");
    },
  });
};
