import React, { useState, useEffect } from "react";
import topTalentData from "../utils/data/top-talent.json";
import { Button } from "./ui/button";

const TopTalentSection = () => {
  const [topTalent, setTopTalent] = useState<Talent[]>([]);
  const [displayedTalents, setDisplayedTalents] = useState<Talent[]>([]);
  const [talentsToShow, setTalentsToShow] = useState<number>(6);

  type Talent = {
    ID: number;
    "Introduction / Pitch": string;
  };

  useEffect(() => {
    setTopTalent(topTalentData);
  }, []);

  useEffect(() => {
    setDisplayedTalents(topTalent.slice(0, talentsToShow));
  }, [topTalent, talentsToShow]);

  const handleBrowseMore = () => {
    setTalentsToShow(talentsToShow + 6);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Top Talent
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTalents.map((talent) => (
            <div
              key={talent.ID}
              className="p-6 rounded-lg shadow-lg flex flex-col"
              style={{
                background:
                  "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
              }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Talent ID: {talent.ID}
              </h3>
              <p className="text-white mb-4">
                {talent["Introduction / Pitch"]}
              </p>
            </div>
          ))}
        </div>
        {topTalent.length > talentsToShow && (
          <div className="flex justify-center mt-6">
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

export default TopTalentSection;
