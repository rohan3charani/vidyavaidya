import React from "react";
import FormLayout from "../../Components/FormLayout";
import "./Forms.css";

export default function HospitalForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Collaboration request sent! We will get back to you soon.");
  };

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
          <input type="text" placeholder="Enter name" required />
        </div>

        <div className="form-group">
          <label>Contact Person (Name & Role)</label>
          <input type="text" placeholder="e.g. Dr. Jane Smith, Admin" required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="contact@hospital.com" required />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="+91 00000 00000" required />
        </div>
        <div className="form-group">
          <label>Location (City, State)</label>
          <input type="text" placeholder="Full address or city" required />
        </div>

        <div className="form-group full-width">
          <label>Specialization / Main Services</label>
          <input 
            type="text" 
            placeholder="e.g. Pediatrics, Cardiology, General Medicine" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Collaboration Type</label>
          <select required>
            <option value="">Select type</option>
            <option value="free-consultations">Free Consultations</option>
            <option value="discounted-treatments">Discounted Treatments</option>
            <option value="medical-camps">Co-organizing Medical Camps</option>
            <option value="emergency-support">Emergency Support</option>
          </select>
        </div>
        <div className="form-group">
          <label>Number of Beds (Optional)</label>
          <input type="number" placeholder="Total bed capacity" />
        </div>

        <div className="form-group full-width">
          <label>Collaboration Details / Proposal</label>
          <textarea 
            rows="4" 
            placeholder="How would your facility like to support VidyaVaidya's mission?"
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-button full-width">Submit Application</button>
      </form>
    </FormLayout>
  );
}
