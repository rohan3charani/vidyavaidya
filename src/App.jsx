import Hero, { WhatWeDo, CTABanner, TeamMembers, SimpleTestimonials } from "./Components/Hero";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import Footer from "./Components/Footer";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "./Components/Loader";
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
import AdminRoute from "./routes/AdminRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import OurMission from "./pages/OurMission";
import Partners from "./pages/Partners";
import GlobalHealthCare from "./pages/GlobalHealthCare";
import SairamHospital from "./pages/SairamHospital";
import TechForGood from "./pages/TechForGood";
import CharaniInfotech from "./pages/CharaniInfotech";
import PhotoGallery from "./pages/PhotoGallery";
import VideoGallery from "./pages/VideoGallery";
import News from "./pages/News";
import Publishings from "./pages/Publishings";
import Contact from "./pages/Contact";
import Home from "./Components/Hero";

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
  const [loading, setLoading] = useState(true);

  // Run the loading animation ONLY on the initial app load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 transition-all duration-700 pointer-events-none ${
          loading ? "opacity-100" : "opacity-0 invisible delay-300"
        }`}
      >
        <Loader />
      </div>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment" element={<Payment />} />
        
        <Route path="/mission" element={<OurMission />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/partners/global-health-care" element={<GlobalHealthCare />} />
        <Route path="/partners/sairam-hospital" element={<SairamHospital />} />
        <Route path="/partners/tech-for-good" element={<TechForGood />} />
        <Route path="/partners/charani-infotech" element={<CharaniInfotech />} />
        <Route path="/PhotoGallery" element={<PhotoGallery />} />
        <Route path="/VideoGallery" element={<VideoGallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/publishings" element={<Publishings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Hero" element={<Home />} />

        {/* ── Admin Routes ── */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        
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
    </>
  );
}