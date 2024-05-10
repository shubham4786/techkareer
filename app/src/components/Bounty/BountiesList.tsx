"use client";
import { useFetchAllJobseekers } from "@/hooks/useJobseekerData";
import React, { useEffect } from "react";
import { JobseekerBox } from "../components";
import { useFilterStore } from "@/store/filterStore";
import { useSession } from "next-auth/react";
import Loader from "../ui/Loader";
import { Bounty, User } from "@/types/type";
import { useFetchAllBounties } from "@/hooks/useJobData";
import BountyCard from "./BountyCard";

function BountiesList() {
    const { data: bounties, isLoading, refetch } = useFetchAllBounties('bounties');

    const { filters } = useFilterStore();
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            refetch();
        }, 500);
        return () => clearTimeout(timeoutID);
    }, [filters.search]);
    return (
        <>
            {isLoading ? (
                <>
                    <div className="max-sm:h-[73vh] max-h-[83vh] flex  justify-center items-center h-full w-full overflow-x-hidden overflow-y-auto ">
                        <Loader size="30px"></Loader>
                    </div>
                </>
            ) : (
                bounties && (
                    <div className="max-xl:block max-sm:h-[73vh] max-h-[83vh] flex gap-[18px] flex-wrap justify-center  w-full overflow-x-hidden overflow-y-auto px-3 py-5 max-xl:py-[0px]">
                        <>
                            {" "}
                            {bounties.map((bounty: Bounty) => (
                                <BountyCard bounty={bounty} />
                            ))}
                        </>
                    </div>
                )
            )}
        </>
    );
}

export default BountiesList;
