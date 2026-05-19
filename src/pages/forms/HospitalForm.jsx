import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../../Components/FormLayout";
import api from "../../services/api";
import "./Forms.css";

export default function HospitalForm() {
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [collaborationType, setCollaborationType] = useState("");
  const [bedCount, setBedCount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("vv_token");
    if (!token) {
      navigate("/auth", { state: { notice: "Please login/register to submit a hospital collaboration request." } });
      return;
    }

    setLoading(true);

    try {
      const specsArray = specialization.split(",").map(s => s.trim()).filter(Boolean);
      if (specsArray.length === 0) {
        throw new Error("Please enter at least one specialization.");
      }

      await api.community.apply("hospital", {
        hospitalName,
        registrationNumber: "REG-" + Math.floor(100000 + Math.random() * 900000),
        specializations: specsArray,
        bedCount: Number(bedCount) || 10,
        contactPerson
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
        heroSubtext="We have received your collaboration request."
        quote="The physician should not treat the disease, but the patient who is suffering from it."
        imageSrc="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
      >
        <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏥</div>
          <h2 style={{ color: "#0A1F44", marginBottom: "1rem" }}>Inquiry Submitted!</h2>
          <p style={{ color: "#4A5568", maxWidth: "450px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
            Thank you for reaching out to collaborate with VidyaVaidya. Our healthcare team will review your proposal and get in touch shortly.
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
      title="Hospital Collaboration"
      heroTitle="Healthcare for Every Child"
      heroSubtext="Collaborate to save lives."
      quote="The physician should not treat the disease, but the patient who is suffering from it."
      imageSrc="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label>Hospital / Clinic Name</label>
          <input 
            type="text" 
            placeholder="Enter name" 
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Contact Person (Name & Role)</label>
          <input 
            type="text" 
            placeholder="e.g. Dr. Jane Smith, Admin" 
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="contact@hospital.com" 
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
            placeholder="Full address or city" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required 
          />
        </div>

        <div className="form-group full-width">
          <label>Specialization / Main Services (Comma-separated)</label>
          <input 
            type="text" 
            placeholder="e.g. Pediatrics, Cardiology, General Medicine" 
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Collaboration Type</label>
          <select 
            value={collaborationType}
            onChange={(e) => setCollaborationType(e.target.value)}
            required
          >
            <option value="">Select type</option>
            <option value="free-consultations">Free Consultations</option>
            <option value="discounted-treatments">Discounted Treatments</option>
            <option value="medical-camps">Co-organizing Medical Camps</option>
            <option value="emergency-support">Emergency Support</option>
          </select>
        </div>
        <div className="form-group">
          <label>Number of Beds (Optional)</label>
          <input 
            type="number" 
            placeholder="Total bed capacity" 
            value={bedCount}
            onChange={(e) => setBedCount(e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label>Collaboration Details / Proposal</label>
          <textarea 
            rows="4" 
            placeholder="How would your facility like to support VidyaVaidya's mission?"
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
