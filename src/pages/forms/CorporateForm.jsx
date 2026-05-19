import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../../Components/FormLayout";
import api from "../../services/api";
import "./Forms.css";

export default function CorporateForm() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [interestArea, setInterestArea] = useState("");
  const [partnershipType, setPartnershipType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("vv_token");
    if (!token) {
      navigate("/auth", { state: { notice: "Please login/register to submit a corporate partnership inquiry." } });
      return;
    }

    setLoading(true);

    try {
      await api.community.apply("corporate", {
        companyName,
        designation: interestArea || "CSR Representative",
        employeeCount: "50-250",
        csrBudget: budgetRange || "Under 5 Lakhs",
        collaborationType: partnershipType
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
        heroSubtext="We have received your partnership proposal."
        quote="The best way to find yourself is to lose yourself in the service of others."
        imageSrc="https://images.unsplash.com/photo-1556761175-4b46a572b786"
      >
        <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤝</div>
          <h2 style={{ color: "#0A1F44", marginBottom: "1rem" }}>Inquiry Submitted!</h2>
          <p style={{ color: "#4A5568", maxWidth: "450px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
            Thank you for reaching out to partner with VidyaVaidya. Our partnership division will review your proposal and get in touch shortly.
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
      title="Corporate Partnership"
      heroTitle="Partner for a Purpose"
      heroSubtext="Create sustainable social impact."
      quote="The best way to find yourself is to lose yourself in the service of others."
      imageSrc="https://images.unsplash.com/photo-1556761175-4b46a572b786"
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label>Company Name</label>
          <input 
            type="text" 
            placeholder="Enter company name" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required 
          />
        </div>

        <div className="form-row full-width">
          <div className="form-group">
            <label>Contact Person Name</label>
            <input 
              type="text" 
              placeholder="Full name" 
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="corporate@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="form-row full-width">
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
            <label>Location (Headquarters)</label>
            <input 
              type="text" 
              placeholder="City, State" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="form-row full-width">
          <div className="form-group">
            <label>CSR Interest Area</label>
            <select 
              value={interestArea}
              onChange={(e) => setInterestArea(e.target.value)}
              required
            >
              <option value="">Select interest area</option>
              <option value="primary-education">Primary Education</option>
              <option value="rural-healthcare">Rural Healthcare</option>
              <option value="skill-dev">Skill Development</option>
              <option value="women-emp">Women Empowerment</option>
            </select>
          </div>
          <div className="form-group">
            <label>Partnership Type</label>
            <select 
              value={partnershipType}
              onChange={(e) => setPartnershipType(e.target.value)}
              required
            >
              <option value="">Select type</option>
              <option value="onetime-grant">One-time Grant</option>
              <option value="longterm-project">Long-term Project</option>
              <option value="event-sponsorship">Event Sponsorship</option>
              <option value="employee-engagement">Employee Engagement</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Budget Range (Annual estimate)</label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            required
          >
            <option value="">Select range</option>
            <option value="low">Under 5 Lakhs</option>
            <option value="mid">5 - 20 Lakhs</option>
            <option value="high">Above 20 Lakhs</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Message / Partnership Proposal</label>
          <textarea 
            rows="4" 
            placeholder="Briefly describe how your organization would like to collaborate."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
