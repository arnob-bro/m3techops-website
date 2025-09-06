import { useState, useEffect } from 'react';
import { 
  FaSearch, FaPlus, FaEdit, FaTrash, FaEnvelope, 
  FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaPaperPlane
} from 'react-icons/fa';
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Modal from 'react-modal';
import './ManageNewsletter.css';
import NewsLetterApi from '../../../apis/newsLetterApi';

const newsLetterApi = new NewsLetterApi();

const ManageNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [newsletters, setNewsletters] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState(null);
  const [currentNewsletter, setCurrentNewsletter] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [subscribersStatusFilter, setSubscribersStatusFilter] = useState('');
  const [subscriberPage, setSubscriberPage] = useState(1);
  const [subscriberTotalPages, setSubscriberTotalPages] = useState(1);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberStatusFilter, setSubscriberStatusFilter] = useState('');

  const [newsletterPage, setNewsletterPage] = useState(1);
  const [newsletterTotalPages, setNewsletterTotalPages] = useState(1);
  const [newsletterSearch, setNewsletterSearch] = useState('');
  const [newsletterStatusFilter, setNewsletterStatusFilter] = useState('');

  const [activeTab, setActiveTab] = useState('subscribers');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    status: 'active',
    subscribed_date: new Date().toISOString().split('T')[0]
  });
  const [newsletterFormData, setNewsletterFormData] = useState({
    subject: '',
    content: '',
    scheduledFor: '',
    status: 'draft'
  });
  const subscribersPerPage = 10;

  const fetchSubscribers = async () => {
    try {
      const result = await newsLetterApi.getSubscribers({
        page: subscriberPage,
        limit: subscribersPerPage,
        email: subscriberSearch,
        status: subscriberStatusFilter,
      });
  
      setSubscribers(result.subscribers || []);
      setSubscriberTotalPages(result.pagination?.totalPages || 1);
      setTotalSubscribers(result.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to fetch subscribers", err);
      setSubscribers([]);
      setSubscriberTotalPages(1);
      setTotalSubscribers(0);
    }
  };

  useEffect(() => {
    Modal.setAppElement('#root');
    
    fetchSubscribers();

  },  [subscriberPage, subscriberSearch, subscriberStatusFilter]);

  const fetchNewsletters = async () => {
    try {
      // mock for now, replace with API later
      const mockNewsletters = [
        {
          id: '1',
          subject: 'Weekly Tech Insights - August Edition',
          content: 'This week we explore the latest in AI advancements and cloud computing trends...',
          status: 'sent',
          sentAt: '2023-08-15'
        },
        {
          id: '2',
          subject: 'New Service Offerings - Cloud Solutions',
          content: 'We are excited to announce our new cloud infrastructure services designed for...',
          status: 'scheduled',
          scheduledFor: '2023-09-01'
        },
        {
          id: '3',
          subject: 'Q2 Company Updates & Achievements',
          content: 'As we wrap up the second quarter, we wanted to share some of our major milestones...',
          status: 'draft'
        }
      ];
      setNewsletters(mockNewsletters);
      setNewsletterTotalPages(5); // example
    } catch (err) {
      console.error("Failed to fetch newsletters", err);
      setNewsletters([]);
      setNewsletterTotalPages(1);
    }
  };
  
  useEffect(() => {
    fetchNewsletters();
  }, [newsletterPage, newsletterSearch, newsletterStatusFilter]);

  useEffect(() => {
    if (isSubscriberModalOpen || isNewsletterModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isSubscriberModalOpen, isNewsletterModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewsletterInputChange = (e) => {
    const { name, value } = e.target;
    setNewsletterFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleStatus = async (subscriber_id,status) => {
    const newStatus = (status === "Active")? "Inactive" : "Active";
    const changed = await newsLetterApi.updateSubscriberStatus(subscriber_id,newStatus);
    if(changed){
      setSubscribers(subscribers.map(subscriber => 
        subscriber.subscriber_id === subscriber_id ? { 
          ...subscriber, 
          status: newStatus,
        } : subscriber
      ));
    }
    
  };

  const openEditSubscriberModal = (subscriber) => {
    setCurrentSubscriber(subscriber);
    setFormData({
      email: subscriber.email,
      status: subscriber.status,
      subscribed_date: subscriber.subscribed_date
    });
    setIsSubscriberModalOpen(true);
  };

  const openEditNewsletterModal = (newsletter) => {
    setCurrentNewsletter(newsletter);
    setNewsletterFormData({
      subject: newsletter.subject,
      content: newsletter.content,
      scheduledFor: newsletter.scheduledFor || '',
      status: newsletter.status
    });
    setIsNewsletterModalOpen(true);
  };

  const openAddSubscriberModal = () => {
    setCurrentSubscriber(null);
    setFormData({
      email: '',
      status: 'Active',
      subscribed_date: new Date().toISOString().split('T')[0]
    });
    setIsSubscriberModalOpen(true);
  };

  const openAddNewsletterModal = () => {
    setCurrentNewsletter(null);
    setNewsletterFormData({
      subject: '',
      content: '',
      scheduledFor: '',
      status: 'draft'
    });
    setIsNewsletterModalOpen(true);
  };

  const handleSubscriberSubmit = (e) => {
    e.preventDefault();
    
    if (currentSubscriber) {
      setSubscribers(subscribers.map(subscriber => 
        subscriber.id === currentSubscriber.id ? { ...subscriber, ...formData } : subscriber
      ));
    } else {
      const newSubscriber = {
        id: Date.now().toString(),
        ...formData
      };
      setSubscribers([...subscribers, newSubscriber]);
    }
    setIsSubscriberModalOpen(false);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    
    if (currentNewsletter) {
      setNewsletters(newsletters.map(newsletter => 
        newsletter.id === currentNewsletter.id ? { ...newsletter, ...newsletterFormData } : newsletter
      ));
    } else {
      const newNewsletter = {
        id: Date.now().toString(),
        sentAt: newsletterFormData.status === 'sent' ? new Date().toISOString().split('T')[0] : null,
        ...newsletterFormData
      };
      setNewsletters([...newsletters, newNewsletter]);
    }
    setIsNewsletterModalOpen(false);
  };

  const deleteSubscriber = (id) => {
    setSubscribers(subscribers.filter(subscriber => subscriber.id !== id));
  };

  const deleteNewsletter = (id) => {
    setNewsletters(newsletters.filter(newsletter => newsletter.id !== id));
  };

  const sendNewsletter = (id) => {
    setNewsletters(newsletters.map(newsletter => 
      newsletter.id === id ? { 
        ...newsletter, 
        status: 'sent',
        sentAt: new Date().toISOString().split('T')[0]
      } : newsletter
    ));
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.email.toLowerCase().includes(subscriberSearch.toLowerCase()) 
    
    const matchesStatus = subscriberStatusFilter === '' || subscriber.status === subscriberStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'status-badge active' : 'status-badge inactive';
  };

  const getNewsletterStatusBadge = (status) => {
    if (status === 'sent') return 'status-badge sent';
    if (status === 'scheduled') return 'status-badge scheduled';
    return 'status-badge draft';
  };

  return (
    <div className="manage-newsletter">
      <div className="newsletter-header">
        <h2>Newsletter Management</h2>
        <div className="newsletter-tabs">
          <button 
            className={activeTab === 'subscribers' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('subscribers')}
          >
            Subscribers
          </button>
          <button 
            className={activeTab === 'newsletters' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('newsletters')}
          >
            Newsletters
          </button>
        </div>
      </div>

      {activeTab === 'subscribers' ? (
        <>
          <div className="newsletter-actions">
            <div className="newsletter-search">
              <input
                type="text"
                placeholder="Search subscribers..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="newsletter-filters">
              <select 
                value={subscriberStatusFilter} 
                onChange={(e) => setSubscriberStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button onClick={openAddSubscriberModal} className="newsletter-btn-add">
              <FaPlus size={16} />
              Add Subscriber
            </button>
          </div>

          <div className="newsletter-table-container">
            <table className="newsletter-table">
              <thead>
                <tr>
                  <th>Subscriber</th>
                  <th>Subscribed Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map(subscriber => (
                    <tr key={subscriber.subscriber_id}>
                      <td>
                        <div className="subscriber-info">
                          <div className="subscriber-avatar">
                            <FaEnvelope />
                          </div>
                          <div className="subscriber-details">
                            <h4>{subscriber.email || 'Unknown Subscriber'}</h4>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <span className="subscriber-date">
                          <FaCalendarAlt size={12} />
                          {formatDate(subscriber.subscribed_date)}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleToggleStatus(subscriber.subscriber_id,subscriber.status)} 
                          className={getStatusBadge(subscriber.status)}
                        >
                          {subscriber.status === 'Active' ? (
                            <>
                              <FaCheckCircle /> Active
                            </>
                          ) : (
                            <>
                              <FaTimesCircle /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <FaEdit 
                            onClick={() => openEditSubscriberModal(subscriber)} 
                            className="edit-icon"
                            aria-label="Edit subscriber"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-results">
                    <td colSpan="5">
                      No subscribers found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {subscriberTotalPages > 1 && (
            <div className="pagination">
              {/* Previous */}
              <button
                onClick={() => setSubscriberPage((prev) => Math.max(prev - 1, 1))}
                disabled={subscriberPage === 1}
                className="pagination-btn"
              >
                <FiChevronLeft /> Previous
              </button>

              <div className="page-numbers">
                {/* Always show first 3 pages */}
                {Array.from({ length: Math.min(3, subscriberTotalPages) }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => setSubscriberPage(number)}
                      className={subscriberPage === number ? "active" : ""}
                    >
                      {number}
                    </button>
                  )
                )}

                {/* Ellipsis if currentPage > 4 and not near the end */}
                {subscriberPage > 4 && subscriberPage < subscriberTotalPages - 2 && <span>...</span>}

                {/* Show current page if it's not within the first 3 or last 1 */}
                {subscriberPage > 3 && subscriberPage < subscriberTotalPages - 1 && (
                  <button
                    onClick={() => setCurrentPage(subscriberPage)}
                    className="active"
                  >
                    {subscriberPage}
                  </button>
                )}

                {/* Ellipsis before last page if needed */}
                {subscriberPage < subscriberTotalPages - 2 && subscriberTotalPages > 4 && <span>...</span>}

                {/* Always show last page if it's not already shown */}
                {subscriberTotalPages > 3 && (
                  <button
                    onClick={() => setCurrentPage(subscriberTotalPages)}
                    className={subscriberPage === subscriberTotalPages ? "active" : ""}
                  >
                    {subscriberTotalPages}
                  </button>
                )}
              </div>

              {/* Next */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, subscriberTotalPages))}
                disabled={subscriberPage === subscriberTotalPages}
                className="pagination-btn"
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}


          </div>

          {/* Subscriber Modal */}
          <Modal
            isOpen={isSubscriberModalOpen}
            onRequestClose={() => setIsSubscriberModalOpen(false)}
            className="newsletter-modal"
            overlayClassName="newsletter-modal-overlay"
          >
            <div className="newsletter-modal-content">
              <div className="newsletter-modal-header">
                <h3>{currentSubscriber ? 'Edit Subscriber' : 'Add New Subscriber'}</h3>
                <button 
                  onClick={() => setIsSubscriberModalOpen(false)} 
                  className="newsletter-modal-close"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
              
              <div className="newsletter-modal-form-container">
                <form onSubmit={handleSubscriberSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name (Optional)</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter subscriber name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Subscription Date</label>
                      <input
                        type="date"
                        name="subscribed_date"
                        value={formData.subscribed_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" onClick={() => setIsSubscriberModalOpen(false)} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      {currentSubscriber ? 'Save Changes' : 'Add Subscriber'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <>
          <div className="newsletter-actions">
            <div className="newsletter-search">
              <input
                type="text"
                placeholder="Search newsletters..."
                value={newsletterSearch}
                onChange={(e) => setNewsletterSearch(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="newsletter-filters">
              <select 
                value={newsletterSearch} 
                onChange={(e) => setNewsletterSearch(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sent">Sent</option>
              </select>
            </div>
            <button onClick={openAddNewsletterModal} className="newsletter-btn-add">
              <FaPlus size={16} />
              Create Newsletter
            </button>
          </div>

          <div className="newsletter-table-container">
            <table className="newsletter-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.length > 0 ? (
                  newsletters.map(newsletter => (
                    <tr key={newsletter.id}>
                      <td>
                        <div className="newsletter-subject">
                          <h4>{newsletter.subject}</h4>
                          <p>{newsletter.content.substring(0, 60)}...</p>
                        </div>
                      </td>
                      <td>
                        <span className={getNewsletterStatusBadge(newsletter.status)}>
                          {newsletter.status === 'sent' && <FaCheckCircle />}
                          {newsletter.status === 'scheduled' && <FaCalendarAlt />}
                          {newsletter.status === 'draft' && <FaEdit />}
                          {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className="newsletter-date">
                          {newsletter.status === 'sent' && formatDate(newsletter.sentAt)}
                          {newsletter.status === 'scheduled' && formatDate(newsletter.scheduledFor)}
                          {newsletter.status === 'draft' && 'Draft'}
                        </span>
                      </td>
                     <td>
  <div className="action-buttons">
    <FaEdit 
      onClick={() => openEditNewsletterModal(newsletter)} 
      className="edit-icon"
      aria-label="Edit newsletter"
    />
    {newsletter.status === 'draft' && (
      <FaPaperPlane 
        onClick={() => sendNewsletter(newsletter.id)} 
        className="send-icon"
        aria-label="Send newsletter"
      />
    )}
    <FaTrash 
      onClick={() => deleteNewsletter(newsletter.id)} 
      className="delete-icon"
      aria-label="Delete newsletter"
    />
  </div>
</td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-results">
                    <td colSpan="6">
                      No newsletters found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Newsletter Modal */}
          <Modal
            isOpen={isNewsletterModalOpen}
            onRequestClose={() => setIsNewsletterModalOpen(false)}
            className="newsletter-modal large"
            overlayClassName="newsletter-modal-overlay"
          >
            <div className="newsletter-modal-content">
              <div className="newsletter-modal-header">
                <h3>{currentNewsletter ? 'Edit Newsletter' : 'Create Newsletter'}</h3>
                <button 
                  onClick={() => setIsNewsletterModalOpen(false)} 
                  className="newsletter-modal-close"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
              
              <div className="newsletter-modal-form-container">
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={newsletterFormData.subject}
                        onChange={handleNewsletterInputChange}
                        placeholder="Enter newsletter subject"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
  <div className="form-group full-width">
    <label>
      Content * 
      <span className="content-help">
        (You can paste Word content as HTML. Use{" "}
        <a 
          href="https://wordtohtml.net/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          this tool
        </a>{" "}if needed)
      </span>
    </label>
    <textarea
      name="content"
      value={newsletterFormData.content}
      onChange={handleNewsletterInputChange}
      placeholder="Write your newsletter content here..."
      rows="8"
      required
    />
  </div>
</div>


                  <div className="form-row">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={newsletterFormData.status}
                        onChange={handleNewsletterInputChange}
                        required
                      >
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="sent">Send Now</option>
                      </select>
                    </div>
                    
                    {newsletterFormData.status === 'scheduled' && (
                      <div className="form-group">
                        <label>Schedule For</label>
                        <input
                          type="datetime-local"
                          name="scheduledFor"
                          value={newsletterFormData.scheduledFor}
                          onChange={handleNewsletterInputChange}
                          required={newsletterFormData.status === 'scheduled'}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" onClick={() => setIsNewsletterModalOpen(false)} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      {currentNewsletter ? 'Save Changes' : 'Create Newsletter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ManageNewsletter;