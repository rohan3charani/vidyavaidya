import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../../Components/FormLayout";
import api from "../../services/api";
import "./Forms.css";

export default function DonorForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [donationType, setDonationType] = useState("");
  const [preferredCause, setPreferredCause] = useState("");
  const [location, setLocation] = useState("");
  const [alumniInfo, setAlumniInfo] = useState("");
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("vv_token");
    if (!token) {
      navigate("/auth", { state: { notice: "Please login/register to submit a donor application." } });
      return;
    }

    setLoading(true);

    try {
      await api.community.apply("donor", {
        name,
        email,
        phone,
        donationType,
        preferredCause,
        location,
        alumniInfo: alumniInfo || "",
        motivation
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit application. You might already have a pending application.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <FormLayout
        title="Application Successful"
        heroTitle="Thank You!"
        heroSubtext="We have received your application."
        quote="We make a living by what we get, but we make a life by what we give."
        imageSrc="https://images.unsplash.com/photo-1601597111158-2fceff292cdc"
      >
        <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>💖</div>
          <h2 style={{ color: "#0A1F44", marginBottom: "1rem" }}>Application Submitted!</h2>
          <p style={{ color: "#4A5568", maxWidth: "450px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
            Thank you for registering your interest to support VidyaVaidya. Our coordinators will review your details and get back to you soon.
          </p>
          <button 
            className="submit-button" 
            style={{ maxWidth: "200px", margin: "0 auto" }} 
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Donor Registration"
      heroTitle="Give Hope. Make Impact."
      heroSubtext="Every contribution matters."
      quote="We make a living by what we get, but we make a life by what we give."
      imageSrc="https://images.unsplash.com/photo-1601597111158-2fceff292cdc"
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label>Full Name / Organization Name</label>
          <input 
            type="text" 
            placeholder="Enter name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            placeholder="+91 00000 00000" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Donation Type</label>
          <select 
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
            required
          >
            <option value="">Select type</option>
            <option value="one-time">One-time Donation</option>
            <option value="monthly">Monthly Support</option>
            <option value="annual">Annual Sponsorship</option>
          </select>
        </div>
        <div className="form-group">
          <label>Preferred Cause</label>
          <select 
            value={preferredCause}
            onChange={(e) => setPreferredCause(e.target.value)}
            required
          >
            <option value="">Select cause</option>
            <option value="education">Child Education</option>
            <option value="healthcare">Medical Infrastructure</option>
            <option value="nutrition">Healthy Food Program</option>
            <option value="general">Where most needed</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Location</label>
          <input 
            type="text" 
            placeholder="City, State" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required 
          />
        </div>

        <div className="form-group full-width">
          <label>Are you an Alumnus? (Optional)</label>
          <input 
            type="text" 
            placeholder="School/Batch if applicable" 
            value={alumniInfo}
            onChange={(e) => setAlumniInfo(e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label>Why do you wish to contribute to VidyaVaidya?</label>
          <textarea 
            rows="4" 
            placeholder="Share your inspiration with us..."
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            required
          ></textarea>
        </div>

        {error && (
          <div className="form-group full-width" style={{ color: "#ef4444", fontSize: "0.875rem" }}>
            ⚠ {error}
          </div>
        )}

        <button type="submit" className="submit-button full-width" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </FormLayout>
  );
}
