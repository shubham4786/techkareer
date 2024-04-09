import React from "react";

interface AdvisorCardProps {
  name: string;
  photo: string;
  designation: string;
}

const AdvisorCard = ({ name, photo, designation }: AdvisorCardProps) => {
  return (
    <div
      className="antialiased p-6 rounded-lg shadow-md flex flex-col items-center"
      style={{
        background:
          "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
      }}
    >
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 mb-4 rounded-full text-white text-sm"
          src={photo}
          alt={name}
        />
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          {name}
        </h3>
        <span className="text-white text-sm sm:text-md text-center">
          {designation}
        </span>
      </div>
    </div>
  );
};

export default AdvisorCard;
