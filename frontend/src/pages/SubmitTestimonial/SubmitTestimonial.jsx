import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TestimonialApi from "../../apis/testimonialApi";

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
  const [checking, setChecking] = useState(true); // loading status for fetch
  const [invalidToken, setInvalidToken] = useState(false); // loading status for fetch
  

  // Fetch testimonial data and feedback status
  const fetchTestimonial = async () => {
    try {
      const feedbackStatusRes = await testimonialApi.getTestimonialFeedbackStatusByToken(token);
  
      // Token invalid or API error
      if (!feedbackStatusRes.success) {
        if (feedbackStatusRes.message === "Invalid or expired testimonial token") {
          setInvalidToken(true);
        } else {
          setError(feedbackStatusRes.message);
        }
        setChecking(false);
        return;
      }
  
      // Already submitted
      if (feedbackStatusRes.testimonialFeedbackStatus) {
        setAlreadySubmitted(true);
        setError("You have already submitted feedback for this testimonial.");
        setChecking(false);
        return;
      }
  
      // Fetch testimonial data
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
      
      // Check if the error contains the invalid token message
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
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }
  
  if (invalidToken) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px", color: "red" }}>
        ❌ Invalid or expired token.
      </div>
    );
  }
  
  if (submitted || alreadySubmitted) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        ✅ Thank you! You have already submitted your testimonial.
      </div>
    );
  }
  

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Submit Testimonial</h1>
      {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="client_name"
            value={formData.client_name}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Upload Your Image:</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
          {previewUrl && (
            <div style={{ marginTop: "10px" }}>
              <img src={previewUrl} alt="Preview" style={{ width: "150px", borderRadius: "8px" }} />
            </div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Feedback:</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleInputChange}
            placeholder="Write your testimonial..."
            rows={6}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          />
        </div>

        <button
          type="submit"
          style={{ padding: "10px 20px", cursor: loading ? "not-allowed" : "pointer" }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SubmitTestimonial;
