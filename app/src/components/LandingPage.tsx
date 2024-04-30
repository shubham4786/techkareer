import { Navbar } from "./Navbar";
import { Feature } from "./feature";
import { InfiniteMovingCards } from "./infinite-card";
import { Welcome } from "./welcome";
import testimonials from "@/assets/testimonials/testimonials";
import { Oppurtunities } from "./oppurtunities";
import { Companies } from "./companies";
import { Sponsor } from "./sponsor";
import { Footer } from "./footer";


const LandingPage = () => {
  return (
    <main className="min-h-screen relative scroll-smooth ">
    <Navbar />
    <Welcome/>
    <InfiniteMovingCards
        items={testimonials}
        className="mt-0"
        direction="left"
        speed="slow"
      />
      <Feature/>
      <Oppurtunities/>
      <Companies/>
      <Sponsor/>
      <Footer/>
    </main>
  );
};

export default LandingPage;
