"use client";
import BountyDetails from "@/components/Bounty/BountyDetails";
import { BottomBar, JobDetails, Navbar } from "@/components/components";
import { useFetchSingleBounty, useFetchSingleJob, useFetchSingleOpportunity } from "@/hooks/useJobData";
import React from "react";

function JobDetailsPage({ params }: { params: { id: string } }) {
    const { data: bounty, isLoading } = useFetchSingleBounty(
        params.id
    );
    return (
        <>
            {isLoading ? (<>
                <Navbar>{"Loading"}</Navbar>{" "}</>
            ) : (
                bounty && (
                    <>
                        <Navbar>
                            {bounty.gigType}
                        </Navbar>{" "}
                        <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] ">
                            <BountyDetails bounty={bounty} />
                        </div>
                        <BottomBar></BottomBar>

                    </>
                )
            )}
        </>
    );
}

export default JobDetailsPage;
