import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import jobOpportunitiesData from "../utils/data/job-opportunities.json";

const JobOpportunities = () => {
  const initialDisplayedJobs = 4;
  const [displayedJobs, setDisplayedJobs] = useState(initialDisplayedJobs);
  const router = useRouter();

  const handleJobOpportunityClick = (jobId: String) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleBrowseMore = () => {
    setDisplayedJobs(displayedJobs + 4);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Job Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {jobOpportunitiesData.slice(0, displayedJobs).map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-lg shadow-lg bg-gray-800 flex flex-col cursor-pointer"
              onClick={() => handleJobOpportunityClick(job.jobId)}
            >
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <Image
                    alt="company-logo"
                    src={require(`../utils/images/${job.logo}`).default}
                    height={50}
                    width={50}
                  />
                  <h3 className="text-xl font-semibold text-white">
                    {job.name}
                  </h3>
                </div>

                <p className="text-gray-400">{job.companyName}</p>
              </div>
              <p className="text-gray-300 mb-6">{job.oneLiner}</p>
              <p className="text-gray-300 mb-6">{job.description}</p>
              <div className="flex flex-col sm:flex-row justify-between text-gray-400 mb-6">
                <p>{job.payRange}</p>
                <p>{job.role}</p>
                <p>{job.type}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between text-gray-400">
                <p>{job.location}</p>
                <p>Date:{job.createdAt}</p>
                <p>Job-id:{job.jobId}</p>
              </div>
            </div>
          ))}
        </div>

        {displayedJobs < jobOpportunitiesData.length && (
          <div className="flex items-center justify-center mt-8">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={handleBrowseMore}
            >
              Browse More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobOpportunities;
