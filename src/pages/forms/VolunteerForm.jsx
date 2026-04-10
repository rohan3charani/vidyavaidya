import React from "react";
import FormLayout from "../../Components/FormLayout";
import "./Forms.css";

export default function VolunteerForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application submitted successfully!");
  };

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
          <input type="text" placeholder="Enter your full name" required />
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
          <label>Location (City, State)</label>
          <input type="text" placeholder="e.g. Mumbai, Maharashtra" required />
        </div>
        <div className="form-group">
          <label>Availability</label>
          <select required>
            <option value="">Select availability</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Skills & Expertise</label>
          <input type="text" placeholder="e.g. Teaching, Nursing, Management" required />
        </div>

        <div className="form-group full-width">
          <label>Area of Interest</label>
          <select required>
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
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-button full-width">Submit Application</button>
      </form>
    </FormLayout>
  );
}
