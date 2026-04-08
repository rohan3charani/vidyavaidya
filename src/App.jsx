import Hero, { WhatWeDo, CTABanner, TeamMembers, SimpleTestimonials } from "./Components/Hero";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import Footer from "./Components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <WhatWeDo />
      <TeamMembers />
      <CTABanner />
      <SimpleTestimonials />
      <Footer />
    </>
  );
}