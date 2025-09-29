import { useState, useEffect } from "react";
import axios from "axios";
import "./ManageTestimonials.css"; 
import TestimonialApi from "../../../apis/testimonialApi";
const testimonialApi = new TestimonialApi();

export default function TestimonialManagement() {
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    company_name: "",
    designation: ""
  });
  const [testimonials, setTestimonials] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      const res = await testimonialApi.getTestimonials({
        page: 1,
        limit: 10,
        searchTerm: "",
        status: ""
      });
      setTestimonials(res.testimonials);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Handle form input
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle init submission
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await testimonialApi.initTestimonial(form);
      setMessage(res.message);
      setForm({
        client_name: "",
        client_email: "",
        company_name: "",
        designation: ""
      });
      setOpen(false);
      fetchTestimonials();
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(t => {
    const term = search.toLowerCase();
    return (
      t.client_name?.toLowerCase().includes(term) ||
      t.client_email?.toLowerCase().includes(term) ||
      t.company_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="testimonial-management">
      <h2>Manage Testimonials</h2>

      {/* Search + Button */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search testimonials..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setOpen(true)}>Init Testimonial</button>
      </div>

      {message && <p className="message">{message}</p>}

      {/* Testimonials List */}
      <ul className="testimonial-list">
        {filteredTestimonials.map(t => (
          <li key={t.testimonial_id} className="testimonial-card">
            <h3>{t.client_name || "Unnamed"}</h3>
            <p>
              <strong>Email:</strong> {t.client_email}
            </p>
            <p>
              <strong>Company:</strong> {t.company_name || "N/A"}
            </p>
            <p>
              <strong>Designation:</strong> {t.designation || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {t.feedback ? "✅ Feedback Given" : "❌ Awaiting Feedback"}
            </p>
            {t.feedback && (
              <blockquote>
                <em>{t.feedback}</em>
              </blockquote>
            )}
          </li>
        ))}
      </ul>

      {/* Modal */}
      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Initialize Testimonial</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="client_name"
                placeholder="Client Name"
                value={form.client_name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="client_email"
                placeholder="Client Email"
                value={form.client_email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={form.company_name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={form.designation}
                onChange={handleChange}
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Send Email</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
