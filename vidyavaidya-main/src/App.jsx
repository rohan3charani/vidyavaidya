import Hero, { WhatWeDo, CTABanner, TeamMembers, SimpleTestimonials } from "./Components/Hero";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import Footer from "./Components/Footer";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import OtpPage from "./pages/OtpPage";
import Dashboard from "./pages/Dashboard";
import Donate from "./pages/Donate";
import Payment from "./pages/Payment";
import JoinCommunity from "./pages/JoinCommunity";
import VolunteerForm from "./pages/forms/VolunteerForm";
import DonorForm from "./pages/forms/DonorForm";
import CorporateForm from "./pages/forms/CorporateForm";
import HospitalForm from "./pages/forms/HospitalForm";
import ProtectedRoute from "./routes/ProtectedRoute";

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
      
      {/* Community Routes - Protected */}
      <Route 
        path="/join-community" 
        element={
          <ProtectedRoute>
            <JoinCommunity />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/join/volunteer" 
        element={
          <ProtectedRoute>
            <VolunteerForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/join/donor" 
        element={
          <ProtectedRoute>
            <DonorForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/join/corporate" 
        element={
          <ProtectedRoute>
            <CorporateForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/join/hospital" 
        element={
          <ProtectedRoute>
            <HospitalForm />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}