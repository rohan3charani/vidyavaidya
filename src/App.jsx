import Hero, { WhatWeDo, CTABanner, TeamMembers } from "./Components/Hero";
import Navbar from "./Components/Navbar";
import About from "./Components/About";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <WhatWeDo />
      <TeamMembers />
      <CTABanner />
    </>
  );
}