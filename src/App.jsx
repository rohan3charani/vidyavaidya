import Hero, { WhatWeDo, CTABanner, TeamMembers, SimpleTestimonials } from "./Components/Hero";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import Footer from "./Components/Footer";
import { Route, Routes } from "react-router-dom";
import Hero, { WhatWeDo, CTABanner, TeamMembers } from "./Components/Hero";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import AuthPage from "./pages/AuthPage";
import OtpPage from "./pages/OtpPage";
import Dashboard from "./pages/Dashboard";
import Donate from "./pages/Donate";
import Payment from "./pages/Payment";

function LandingPage() {
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}