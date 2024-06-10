import { Skeleton } from "../ui/skeleton"
export const FormSkeleton = ()=>{
    return (
        <div className=" w-full flex flex-col">
        <div className="flex justify-start items-center w-[100%] gap-16 mb-12 px-4">
          <Skeleton className="w-[300px] " />
          <Skeleton className="w-[300px] " />
        </div>
        <div className="flex justify-start items-center w-[100%] gap-16 mb-12">
          <Skeleton className="w-[600px] h-[80px]" />
        </div>
        <div className="flex justify-start items-center w-[100%] gap-16 mb-12">
          <Skeleton className="w-[100px] lg:w-[300px] " />
          <Skeleton className="w-[300px] " />
        </div>
        <div className="flex justify-start items-center w-[100%] gap-16 mb-12">
          <Skeleton className="w-[300px] " />
          <Skeleton className="w-[300px] " />
        </div>
        <div className="flex justify-start items-center w-[100%] gap-16 mb-12">
          <Skeleton className="w-[600px] " />
        </div>
      </div>
    )
}