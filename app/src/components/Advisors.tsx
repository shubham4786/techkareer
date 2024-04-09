import React from "react";
import AdvisorCard from "./ui/AdvisorCard";
import {
  RAJESH_MULLAPPA_PHOTO,
  SACHIN_AGGARWAL_PHOTO,
  SHIVAM_BHATIA_PHOTO,
  SHUBHAM_KANODIA_PHOTO,
} from "@/utils/constants";

const Advisors = () => {
  const advisors = [
    {
      name: "Rajest Muppalla",
      image: RAJESH_MULLAPPA_PHOTO,
      description: "Co-Founder at Indix",
    },
    {
      name: "Shivam Bhatia",
      image: SHIVAM_BHATIA_PHOTO,
      description: "Co-Founder at Slingshot",
    },
    {
      name: "Sachin Aggarwal",
      image: SACHIN_AGGARWAL_PHOTO,
      description: "Principal Software Engineer at Quickreply.ai",
    },
    {
      name: "Shubham Kanodia",
      image: SHUBHAM_KANODIA_PHOTO,
      description: "Machine Learning Engineer at Avalara",
    },
  ];
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-xl sm:text-4xl font-bold text-center text-white mb-20">
          Advisors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advisors.map((advisor, index) => (
            <AdvisorCard
              key={index}
              name={advisor.name}
              image={advisor.image}
              description={advisor.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advisors;
