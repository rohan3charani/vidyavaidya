import React from "react";
import FormLayout from "../../Components/FormLayout";
import "./Forms.css";

export default function CorporateForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Partnership inquiry submitted successfully!");
  };

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
          <input type="text" placeholder="Enter company name" required />
        </div>

        <div className="form-row full-width">
          <div className="form-group">
            <label>Contact Person Name</label>
            <input type="text" placeholder="Full name" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="corporate@company.com" required />
          </div>
        </div>

        <div className="form-row full-width">
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 00000 00000" required />
          </div>
          <div className="form-group">
            <label>Location (Headquarters)</label>
            <input type="text" placeholder="City, State" required />
          </div>
        </div>

        <div className="form-row full-width">
          <div className="form-group">
            <label>CSR Interest Area</label>
            <select required>
              <option value="">Select interest area</option>
              <option value="primary-education">Primary Education</option>
              <option value="rural-healthcare">Rural Healthcare</option>
              <option value="skill-dev">Skill Development</option>
              <option value="women-emp">Women Empowerment</option>
            </select>
          </div>
          <div className="form-group">
            <label>Partnership Type</label>
            <select required>
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
          <select>
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
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-button full-width">Submit Application</button>
      </form>
    </FormLayout>
  );
}
