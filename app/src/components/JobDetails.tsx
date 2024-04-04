"use client";

import { Button } from "@/components/ui/button";
import jobOpportunitiesData from "../utils/data/job-opportunities.json";
import { useParams } from "next/navigation";
import Spinner from "./ui/spinner";

const JobDetails = () => {
  const params = useParams();
  const { jobId } = params;

  const job = jobOpportunitiesData.find((job) => job.jobId === jobId);

  if (!job) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 mx-2 p-2">
      <div className="container mx-auto max-w-md p-6 rounded-lg shadow-lg bg-gray-200">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4">
          {job.name}
        </h2>
        <p className="text-gray-600 mb-2">{job.companyName}</p>
        <p className="text-gray-700 mb-6">{job.description}</p>
        <div className="flex flex-col justify-between text-gray-700 mb-6">
          <p>{job.payRange}</p>
          <p>{job.role}</p>
          <p>{job.type}</p>
        </div>
        <div className="flex flex-col justify-between text-gray-700 mb-6">
          <p>Location: {job.location}</p>
          <p>Date: {job.createdAt}</p>
          <p>Job ID: {job.jobId}</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 sm:py-2 px-2 sm:px-4 rounded">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
