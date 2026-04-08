import { Route, Routes } from "react-router-dom";
import Hero, { WhatWeDo, CTABanner, TeamMembers } from "./Components/Hero";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import AuthPage from "./pages/AuthPage";
import OtpPage from "./pages/OtpPage";
import Dashboard from "./pages/Dashboard";

function LandingPage() {
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/donate" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}