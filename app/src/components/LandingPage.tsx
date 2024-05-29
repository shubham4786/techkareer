import { Navbar } from "./Navbar";
import { Feature } from "./feature";
import { InfiniteMovingCards } from "./infinite-card";
import { Welcome } from "./welcome";
import testimonials from "@/assets/testimonials/testimonials";
import { Opportunities } from "./opportunities";
import { Companies } from "./companies";
import { Sponsor } from "./sponsor";
import { Footer } from "./footer";
import { useSession } from "next-auth/react";
import { getData } from "@/utils/getData";

const LandingPage = async () => {
  const data = await getData("Opportunities");

  return (
    <main className="min-h-screen relative scroll-smooth ">
      <Navbar />
      <Welcome />
      <InfiniteMovingCards
        items={testimonials}
        className="mt-0"
        direction="left"
        speed="slow"
      />
      <Feature />
      <Opportunities jobs={data} />
      <Companies />
      {/* <Sponsor /> */}
      <Footer />
    </main>
  );
};

export default LandingPage;
