import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../../Components/FormLayout";
import api from "../../services/api";
import "./Forms.css";

export default function VolunteerForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [skills, setSkills] = useState("");
  const [interest, setInterest] = useState("");
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const token = localStorage.getItem("vv_token");
    if (!token) {
      navigate("/auth", { state: { notice: "Please login/register to submit a volunteer application." } });
      return;
    }

    setLoading(true);

    try {
      const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
      if (skillsArray.length === 0) {
        throw new Error("Please enter at least one skill.");
      }

      await api.community.apply("volunteer", {
        name,
        email,
        phone,
        skills: skillsArray,
        availability,
        experience: `Interest: ${interest}`,
        motivation: motivation,
        preferredDays: availability === "weekdays" ? ["Weekdays"] : availability === "weekends" ? ["Weekends"] : ["Weekdays", "Weekends"],
        location
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
        quote="Volunteers do not necessarily have the time; they just have the heart."
        imageSrc="https://images.unsplash.com/photo-1559027615-cd4628902d4a"
      >
        <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
          <h2 style={{ color: "#0A1F44", marginBottom: "1rem" }}>Application Submitted!</h2>
          <p style={{ color: "#4A5568", maxWidth: "450px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
            Thank you for applying to be a volunteer at VidyaVaidya. Our coordinators will review your details and get back to you soon.
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
      title="Volunteer Registration"
      heroTitle="Be the Change. Volunteer Today."
      heroSubtext="Your time can transform lives."
      quote="Volunteers do not necessarily have the time; they just have the heart."
      imageSrc="https://images.unsplash.com/photo-1559027615-cd4628902d4a"
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="Enter your full name" 
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
          <label>Location (City, State)</label>
          <input 
            type="text" 
            placeholder="e.g. Mumbai, Maharashtra" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Availability</label>
          <select 
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
          >
            <option value="">Select availability</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Skills & Expertise (Comma-separated)</label>
          <input 
            type="text" 
            placeholder="e.g. Teaching, Nursing, Management" 
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required 
          />
        </div>

        <div className="form-group full-width">
          <label>Area of Interest</label>
          <select 
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            required
          >
            <option value="">Select area</option>
            <option value="education">Education (Primary/Secondary)</option>
            <option value="healthcare">Healthcare (Medical/Nursing)</option>
            <option value="admin">Administrative Support</option>
            <option value="events">Event Coordination</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Message / Statement of Purpose</label>
          <textarea 
            rows="4" 
            placeholder="Why do you want to join VidyaVaidya?"
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
