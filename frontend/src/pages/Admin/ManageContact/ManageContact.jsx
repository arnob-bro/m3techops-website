import { useState, useEffect } from "react";
import {
  FiMail,
  FiClock,
  FiSearch,
  FiEye,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "./ManageContact.css";
import ContactApi from "../../../apis/contactApi";

const contactApi = new ContactApi();

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const messagesPerPage = 10;

  // Fetch messages from API with server-side pagination
  const fetchMessages = async (page = 1) => {
    try {
      console.log(currentPage);
      const result = await contactApi.getInquiries({
        page: currentPage,
        limit: messagesPerPage,
        email: searchEmail || "",
        company: searchCompany || "",
        status: statusFilter,
      });
      

      setMessages(result.inquiries || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotalMessages(result.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
      setMessages([]);
      setTotalPages(1);
      setTotalMessages(0);
    }
  };

  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage, searchEmail, searchCompany,statusFilter]);

  const viewMessage = (message) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);
  };

  const deleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await contactApi.deleteInquiry(id); // Call backend
        fetchMessages(currentPage); // Refresh current page
      } catch (err) {
        console.error("Failed to delete message", err);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="manage-contact">
      {/* Header */}
      <div className="contact-header">
        <h2>Contact Messages</h2>
        <p>Manage and respond to inquiries from your contact form</p>
      </div>

      {/* Search */}
      <div className="contact-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by company..."
            value={searchCompany}
            onChange={(e) => {
              setSearchCompany(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Messages</option>
            <option value="Unread">Unread Only</option>
            <option value="Read">Read Only</option>
            <option value="Replied">Replied Only</option>
          </select>
        </div>

      </div>

      {/* Stats */}
      <div className="messages-stats-ac">
        <div className="stat-card-ac">
          <div className="stat-icon total-ac">
            <FiMail />
          </div>
          <div className="stat-info-ac">
            <h3>{totalMessages}</h3>
            <p>Total Messages</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="messages-table-container">
        <table className="messages-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Message Preview</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message.inquiry_id}>
                  <td>
                    <div className="user-info">
                      <div className="avatar">
                        {message.first_name.charAt(0)}
                        {message.last_name.charAt(0)}
                      </div>
                      <div className="name">
                        {message.first_name} {message.last_name}
                        {message.job_title && (
                          <span className="job-title">{message.job_title}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${message.email}`} className="email-link">
                      {message.email}
                    </a>
                  </td>
                  <td>{message.company || "-"}</td>
                  <td>
                    {message.message.length > 100
                      ? `${message.message.substring(0, 100)}...`
                      : message.message}
                  </td>
                  <td>
                    <FiClock /> {formatDate(message.created_at)}
                  </td>
                  <td>{message.status || "Unread"}</td>
                  <td>
                    <div className="action-buttons">
                      <FiEye
                        onClick={() => viewMessage(message)}
                        className="view-icon"
                      />
                      <FiTrash2
                        onClick={() => deleteMessage(message.inquiry_id)}
                        className="delete-icon"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No messages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <FiChevronLeft /> Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={currentPage === number ? "active" : ""}
                >
                  {number}
                </button>
              )
            )}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}

      {/* Modal */}
      {isViewModalOpen && selectedMessage && (
        <div className="modal-overlay">
          <div className="message-modal">
            <div className="modal-header">
              <h3>
                Message from {selectedMessage.first_name}{" "}
                {selectedMessage.last_name}
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <div className="modal-content">
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${selectedMessage.email}`}>
                  {selectedMessage.email}
                </a>
              </p>
              <p>
                <strong>Company:</strong> {selectedMessage.company || "-"}
              </p>
              <p>
                <strong>Job Title:</strong> {selectedMessage.job_title || "-"}
              </p>
              <p>
                <strong>Message:</strong> {selectedMessage.message}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(selectedMessage.created_at)}
              </p>

              {/* Reply Textarea */}
              <div className="reply-box">
                <label htmlFor="replyMessage"><strong>Reply Message:</strong></label>
                <textarea
                  id="replyMessage"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={5}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="reply-btn"
                onClick={async () => {
                  if (!replyMessage.trim()) {
                    alert("Please type a reply message");
                    return;
                  }
                  try {
                    // Call your API to send reply (you need to implement sendReply in ContactApi)
                    await contactApi.sendReply(selectedMessage.inquiry_id, replyMessage);
                    alert("Reply sent successfully");
                    setReplyMessage(""); // Clear textarea
                    setIsViewModalOpen(false); // Close modal
                    fetchMessages(currentPage); // Refresh messages (to mark as replied)
                  } catch (err) {
                    console.error("Failed to send reply", err);
                    alert("Failed to send reply");
                  }
                }}
              >
                Send Reply
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="close-btn"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContact;
