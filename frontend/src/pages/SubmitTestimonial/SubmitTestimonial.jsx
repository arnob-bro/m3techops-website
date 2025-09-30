import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TestimonialApi from "../../apis/testimonialApi";
import './SubmitTestimonial.css'

const testimonialApi = new TestimonialApi();

const SubmitTestimonial = () => {
  const { token } = useParams();

  const [formData, setFormData] = useState({
    client_name: "",
    designation: "",
    image: null,
    feedback: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);

  // Fetch testimonial data and feedback status
  const fetchTestimonial = async () => {
    try {
      const feedbackStatusRes = await testimonialApi.getTestimonialFeedbackStatusByToken(token);
  
      if (!feedbackStatusRes.success) {
        if (feedbackStatusRes.message === "Invalid or expired testimonial token") {
          setInvalidToken(true);
        } else {
          setError(feedbackStatusRes.message);
        }
        setChecking(false);
        return;
      }
  
      if (feedbackStatusRes.testimonialFeedbackStatus) {
        setAlreadySubmitted(true);
        setError("You have already submitted feedback for this testimonial.");
        setChecking(false);
        return;
      }
  
      const testimonialRes = await testimonialApi.getTestimonialByToken(token);
  
      if (!testimonialRes.success) {
        if (testimonialRes.message === "Invalid or expired testimonial token") {
          setInvalidToken(true);
        } else {
          setError(testimonialRes.message);
        }
        setChecking(false);
        return;
      }
  
      setFormData({
        ...formData,
        ...testimonialRes.testimonial,
        image: null,
      });
  
      setChecking(false);
    } catch (err) {
      console.error("Error fetching testimonial:", err);
      
      if (err.message === "Invalid or expired testimonial token") {
        setInvalidToken(true);
      } else {
        setError("Failed to load testimonial data.");
      }
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchTestimonial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.client_name.trim() || !formData.feedback.trim()) {
      setError("Name and feedback are required.");
      return;
    }

    if (!formData.image) {
      setError("Please upload an image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("client_name", formData.client_name);
      data.append("feedback", formData.feedback);
      data.append("designation", formData.designation);
      data.append("image", formData.image);

      if (formData.client_email) data.append("client_email", formData.client_email);
      if (formData.company_name) data.append("company_name", formData.company_name);

      await testimonialApi.submitTestimonial(token, data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit testimonial.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="submit-testimonial-container">
        <div className="testimonial-content-wrapper">
          <div className="testimonial-loading">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (invalidToken) {
    return (
      <div className="submit-testimonial-container">
        <div className="testimonial-content-wrapper">
          <div className="testimonial-status status-error">
            Invalid or expired token
          </div>
        </div>
      </div>
    );
  }
  
  if (submitted || alreadySubmitted) {
    return (
      <div className="submit-testimonial-container">
        <div className="testimonial-content-wrapper">
          <div className="testimonial-status status-success">
            Thank you! You have already submitted your testimonial.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-testimonial-container">
      <div className="testimonial-content-wrapper">
        <div className="testimonial-header">
          <h1>Submit Your Testimonial</h1>
          <p>Share your experience with us. Your feedback helps us improve and inspires others.</p>
        </div>

        <div className="testimonial-form-container">
          {error && (
            <div className="form-error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="testimonial-form" encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="client_name">Your Name *</label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation *</label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Product Manager at Tech Inc."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Upload Your Photo *</label>
              <input 
                type="file" 
                id="image"
                name="image" 
                accept="image/*" 
                onChange={handleImageChange} 
                required 
              />
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="feedback">Your Testimonial *</label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                placeholder="Share your experience working with us..."
                rows={6}
                required
              />
            </div>

            <button
              type="submit"
              className="testimonial-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Submitting...
                </>
              ) : (
                'Submit Testimonial'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitTestimonial;