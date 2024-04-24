import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { isAxiosError } from "axios"
import { useSession } from "next-auth/react"
import { appendToBaseUrl } from "./hooks"
import { Connection } from "@/types/type"
import { toast } from "react-toastify"
import { useState } from "react"

export const useFetchConnections=({status}:{status:string})=>{
    const{data:authData}=useSession()
    const fetchAllConnections=async()=>{
        const response =await axios.get(appendToBaseUrl(`connection/connections/${status}`))
        return response.data.connections
    }   
    return useQuery({queryKey:['connections',authData?.user.id.toString(),status],
        queryFn:fetchAllConnections
    }
)
}

export const useFetchConnectionStatus=(userId:number|undefined)=>{
    const {data:authData} =useSession()
    const fetchConnectionStatus=async()=>{
        const response =await axios.get(appendToBaseUrl(`connection/${userId}/status`))
        return response.data.connection as Connection
    }
    return useQuery({
        queryKey:['connection-status',(authData?.user.id.toString()),(userId &&userId.toString())],
        queryFn:fetchConnectionStatus,
        enabled:(authData?.user.role=='Jobseeker'&& !!userId)
    })
}

export const useHandleConnection=()=>{
    const{data:authData}=useSession()
    const [userId,setUserId]=useState("")
    const [action,setAction]=useState("")
    const handleConnection=async({userId,action}:{userId:number,action:string|null})=>{
        if(!action)return;
        try {
            setUserId(userId.toString())
            setAction(action)
            await axios.put(appendToBaseUrl(`connection/${userId}/${action}`));
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
        mutationFn:handleConnection,
        onError: (error) => {
            console.log(error);
          },
          onSuccess: async () => {
          await queryClient.invalidateQueries({
              queryKey:['connection-status',(authData?.user.id.toString()),(userId &&userId.toString())]                    
            })
          await queryClient.invalidateQueries({queryKey:['connections',authData?.user.id.toString(),'accepted']})
          await queryClient.invalidateQueries({queryKey:['connections',authData?.user.id.toString(),'requests']})
          await queryClient.invalidateQueries({queryKey:['connections',authData?.user.id.toString(),'requested']})

          }
    })
}