import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTestimonials = async () => {
    try {
      const res = await testimonialApi.getTestimonials({
        page,
        limit: 10,
        searchTerm,
        status: activeStatusFilter
      });
      if(res.success){
        setTotalPages(res.pagination.totalPages);
        setTestimonials(res.testimonials);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [page, searchTerm, activeStatusFilter]);

  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
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

  // Open view modal
  const openViewModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    console.log(testimonial);
    setViewModalOpen(true);
  }

  return (
    <div className="testimonial-management">
      <h2>Manage Testimonials</h2>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Search testimonials by client name, email, company, designation..."
          value={searchTerm}
          onChange={e => {
            setPage(1);
            setSearchTerm(e.target.value)
          }}
        />
        <button onClick={() => setOpen(true)}>Init Testimonial</button>
      </div>
      <div className="MT-active-filters">
        <select value={activeStatusFilter} onChange={(e) => {
          setPage(1);
          setActiveStatusFilter(e.target.value)
          }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {message && <p className="message">{message}</p>}

      <table className="testimonial-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.length > 0 ? testimonials.map((t, idx) => (
            <tr key={t.testimonial_id}>
              <td>{(page - 1) * 10 + idx + 1}</td>
              <td>{t.client_name || "Unnamed"}</td>
              <td>{t.client_email}</td>
              <td>{t.company_name || "N/A"}</td>
              <td>{t.designation || "N/A"}</td>
              <td>{t.feedback ? "✅ Feedback Given" : "❌ Awaiting Feedback"}</td>
              <td>
                <button onClick={() => openViewModal(t)}>View</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>No testimonials found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            <FiChevronLeft /> Previous
          </button>

          {(() => {
            const pages = [];
            const delta = 1;
            for (let i = 1; i <= totalPages; i++) {
              if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
                pages.push(i);
              } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
              }
            }
            return pages.map((p, idx) =>
              p === '...' ? (
                <span key={idx} className="pagination-ellipsis">…</span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setPage(p)}
                  className={p === page ? 'active' : ''}
                >
                  {p}
                </button>
              )
            );
          })()}

          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}

      {/* Initialize Modal */}
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
                <button type="button" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit">Send Email</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedTestimonial && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Testimonial Details</h3>
            <p><strong>Client Name:</strong> {selectedTestimonial.client_name}</p>
            <p><strong>Email:</strong> {selectedTestimonial.client_email}</p>
            <p><strong>Company:</strong> {selectedTestimonial.company_name || "N/A"}</p>
            <p><strong>Designation:</strong> {selectedTestimonial.designation || "N/A"}</p>
            <p><strong>Feedback:</strong> {selectedTestimonial.feedback || "-"}</p>
            
              <div>
                <strong>Image:</strong><br/>
                <img src={selectedTestimonial.imageurl || `https://randomuser.me/api/portraits/men/32.jpg`} alt="Client" style={{ width: "150px", borderRadius: "8px", marginTop: "5px" }} />
              </div>
            
            <p><strong>Active:</strong> {selectedTestimonial.active ? "✅ Visible" : "❌ Not Visible"}</p>
            <p><strong>Feedback Taken:</strong> {selectedTestimonial.feedback_taken ? "✅ Feedback Given" : "❌ Awaiting Feedback"}</p>
            <p><strong>Created At:</strong> {new Date(selectedTestimonial.created_at).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(selectedTestimonial.updated_at).toLocaleString()}</p>
            <div className="modal-actions">
              <button type="button" onClick={() => setViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
