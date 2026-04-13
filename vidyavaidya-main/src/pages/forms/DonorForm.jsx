import React from "react";
import FormLayout from "../../Components/FormLayout";
import "./Forms.css";

export default function DonorForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Donors details submitted! Our team will contact you shortly.");
  };

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
          <input type="text" placeholder="Enter name" required />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="email@example.com" required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="+91 00000 00000" required />
        </div>

        <div className="form-group">
          <label>Donation Type</label>
          <select required>
            <option value="">Select type</option>
            <option value="one-time">One-time Donation</option>
            <option value="monthly">Monthly Support</option>
            <option value="annual">Annual Sponsorship</option>
          </select>
        </div>
        <div className="form-group">
          <label>Preferred Cause</label>
          <select required>
            <option value="">Select cause</option>
            <option value="education">Child Education</option>
            <option value="healthcare">Medical Infrastructure</option>
            <option value="nutrition">Healthy Food Program</option>
            <option value="general">Where most needed</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Location</label>
          <input type="text" placeholder="City, State" required />
        </div>

        <div className="form-group full-width">
          <label>Are you an Alumnus? (Optional)</label>
          <input type="text" placeholder="School/Batch if applicable" />
        </div>

        <div className="form-group full-width">
          <label>Why do you wish to contribute to VidyaVaidya?</label>
          <textarea 
            rows="4" 
            placeholder="Share your inspiration with us..."
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-button full-width">Submit Application</button>
      </form>
    </FormLayout>
  );
}
