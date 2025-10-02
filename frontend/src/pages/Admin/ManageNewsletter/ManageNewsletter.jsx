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
  const [totalNewsletters, setTotalNewsletters] = useState(0);
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState(null);
  const [currentNewsletter, setCurrentNewsletter] = useState(null);
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
    status: 'Active',
    subscribed_date: new Date().toISOString().split('T')[0]
  });
  const [newsletterFormData, setNewsletterFormData] = useState({
    title: '',
    content: '',
    status: 'Draft'
  });
  const subscribersPerPage = 10;
  const newslettersPerPage = 10;

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

  const fetchNewsletters = async () => {
    try {
      const result = await newsLetterApi.getNewsletters({
        page: newsletterPage,
        limit: newslettersPerPage,
        title: newsletterSearch,
        status: newsletterStatusFilter,
      });
  
      setNewsletters(result.newsletters || []);
      setNewsletterTotalPages(result.pagination?.totalPages || 1);
      setTotalNewsletters(result.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to fetch subscribers", err);
      setNewsletters([]);
      setNewsletterTotalPages(1);
      setTotalNewsletters(0);
    }
  };

  useEffect(() => {
    Modal.setAppElement('#root');
    
    fetchSubscribers();

  },  [subscriberPage, subscriberSearch, subscriberStatusFilter]);

  
  
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
      title: newsletter.title,
      content: newsletter.content,
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
      title: '',
      content: '',
      status: 'Draft'
    });
    setIsNewsletterModalOpen(true);
  };

  const handleSubscriberSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentSubscriber) {
        // Update subscriber

        const res = await newsLetterApi.updateSubscriberStatus(currentSubscriber.subscriber_id,formData.status);


  
        setSubscribers(
          subscribers.map((subscriber) =>
            subscriber.subscriber_id === currentSubscriber.subscriber_id
              ? res.updatedSubscriber // updated subscriber from backend
              : subscriber
          )
        );
      } else {
        // Create subscriber
        
        const res = await newsLetterApi.subscribe(formData.email);

  
        setSubscribers([...subscribers, res.newSubscription]); // add new subscriber from backend
      }
  
      setIsSubscriberModalOpen(false);
    } catch (err) {
      console.error("Error submitting subscriber:", err);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (currentNewsletter) {

      const res = await newsLetterApi.updateNewsletter(currentNewsletter.newsletter_id,newsletterFormData.title,newsletterFormData.content,newsletterFormData.status, newsletterFormData.sent_date);

      if(res.success){
        setNewsletters(newsletters.map(newsletter => 
          newsletter.newsletter_id === currentNewsletter.newsletter_id 
          ? res.updatedNewsletter
          : newsletter
        ));
        alert("Newspaper has been updated");
      }else{
        alert("Failed to update newspaper");
      }

    } else {

      console.log(newsletterFormData);

      const res = await newsLetterApi.createNewsletter(newsletterFormData);

      
      if(res.success) {
        setNewsletters([...newsletters, res.newNewsletter]);
        alert("Newspaper has been created");
      } else{
        alert("Newspaper creation failed");
      }
    }
    setIsNewsletterModalOpen(false);
  };

  const deleteSubscriber = (id) => {
    setSubscribers(subscribers.filter(subscriber => subscriber.id !== id));
  };

  const deleteNewsletter = (id) => {
    setNewsletters(newsletters.filter(newsletter => newsletter.id !== id));
  };

  const sendNewsletter = async (newsletter_id) => {
    // setNewsletters(newsletters.map(newsletter => 
    //   newsletter.id === id ? { 
    //     ...newsletter, 
    //     status: 'sent',
    //     sentAt: new Date().toISOString().split('T')[0]
    //   } : newsletter
    // ));

    const result = await newsLetterApi.sendNewsletter(newsletter_id);
    if(result.success) alert("Newsletter has been sent successfully");
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
    if (status === 'Sent') return 'status-badge sent';
    
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
                onChange={(e) => {
                  setSubscriberPage(1);
                  setSubscriberSearch(e.target.value);
                }}
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="newsletter-filters">
              <select 
                value={subscriberStatusFilter} 
                onChange={(e) => {
                  setSubscriberPage(1);
                  setSubscriberStatusFilter(e.target.value);
                }}
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
                  onClick={() => setSubscriberPage(prev => Math.max(prev - 1, 1))}
                  disabled={subscriberPage === 1}
                  className="pagination-btn"
                >
                  <FiChevronLeft /> Previous
                </button>
              
                {/* Page numbers with ellipsis */}
                {(() => {
                  const pages = [];
                  const delta = 1; // show ±1 around current
              
                  for (let i = 1; i <= subscriberTotalPages; i++) {
                    if (
                      i === 1 || 
                      i === subscriberTotalPages || 
                      (i >= subscriberPage - delta && i <= subscriberPage + delta)
                    ) {
                      pages.push(i);
                    } else if (pages[pages.length - 1] !== '...') {
                      pages.push('...');
                    }
                  }
              
                  return pages.map((page, idx) =>
                    page === '...' ? (
                      <span key={idx} className="pagination-ellipsis">…</span>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => setSubscriberPage(page)}
                        className={subscriberPage === page ? 'active' : ''}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}
              
                {/* Next */}
                <button
                  onClick={() => setSubscriberPage(prev => Math.min(prev + 1, subscriberTotalPages))}
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
                    {/* <div className="form-group-nl">
                      <label>Name (Optional)</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter subscriber name"
                      />
                    </div> */}
                    
                    <div className="form-group-nl">
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

                  {currentSubscriber && (<div>
                    <div className="form-row">
                    <div className="form-group-nl">
                      <label>Subscription Date</label>
                      <input
                        type="date"
                        name="subscribed_date"
                        value={formatDate(formData.subscribed_date)}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    
                    <div className="form-group-nl">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  </div>)}
                  
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
                onChange={(e) => {
                  setNewsletterPage(1);
                  setNewsletterSearch(e.target.value);
                }}
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="newsletter-filters">
              <select 
                value={newsletterStatusFilter} 
                onChange={(e) => {
                  setNewsletterPage(1);
                  setNewsletterStatusFilter(e.target.value);
                }}
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Canceled">Canceled</option>
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
                    <tr key={newsletter.newsletter_id}>
                      <td>
                        <div className="newsletter-subject">
                          <h4>{newsletter.title}</h4>
                          <p>{newsletter.content.substring(0, 60)}...</p>
                        </div>
                      </td>
                      <td>
                        <span className={getNewsletterStatusBadge(newsletter.status)}>
                          {newsletter.status === 'Sent' && <FaCheckCircle />}
                          {newsletter.status === 'Draft' && <FaEdit />}
                          {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className="newsletter-date">
                          {newsletter.status === 'Sent' && formatDate(newsletter.sent_date)}
                          {newsletter.status === 'Draft' && 'Not sent yet'}
                        </span>
                      </td>
                     <td>
                      <div className="action-buttons">
                        <FaEdit 
                          onClick={() => openEditNewsletterModal(newsletter)} 
                          className="edit-icon"
                          aria-label="Edit newsletter"
                        />
                        {newsletter.status === 'Draft' && (
                          <FaPaperPlane 
                            onClick={() => sendNewsletter(newsletter.newsletter_id)} 
                            className="send-icon"
                            aria-label="Send newsletter"
                          />
                        )}
                        {/* <FaTrash 
                          onClick={() => deleteNewsletter(newsletter.newsletter_id)} 
                          className="delete-icon"
                          aria-label="Delete newsletter"
                        /> */}
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
            {newsletterTotalPages > 1 && (
                <div className="pagination">
                {/* Previous */}
                <button
                  onClick={() => setNewsletterPage(prev => Math.max(prev - 1, 1))}
                  disabled={newsletterPage === 1}
                  className="pagination-btn"
                >
                  <FiChevronLeft /> Previous
                </button>
              
                {/* Page numbers with ellipsis */}
                {(() => {
                  const pages = [];
                  const delta = 1; // show ±1 around current
              
                  for (let i = 1; i <= newsletterTotalPages; i++) {
                    if (
                      i === 1 || 
                      i === newsletterTotalPages || 
                      (i >= newsletterPage - delta && i <= newsletterPage + delta)
                    ) {
                      pages.push(i);
                    } else if (pages[pages.length - 1] !== '...') {
                      pages.push('...');
                    }
                  }
              
                  return pages.map((page, idx) =>
                    page === '...' ? (
                      <span key={idx} className="pagination-ellipsis">…</span>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => setNewsletterPage(page)}
                        className={newsletterPage === page ? 'active' : ''}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}
                {/* Next */}
                <button
                  onClick={() => setNewsletterPage(prev => Math.min(prev + 1, newsletterTotalPages))}
                  disabled={newsletterPage === newsletterTotalPages}
                  className="pagination-btn"
                >
                  Next <FiChevronRight />
                </button>
              </div>
          
          
          )}
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
                    <div className="form-group-nl full-width">
                      <label>Subject *</label>
                      <input
                        type="text"
                        name="title"
                        value={newsletterFormData.title}
                        onChange={handleNewsletterInputChange}
                        placeholder="Enter newsletter subject"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group-nl full-width">
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
                    <div className="form-group-nl">
                      <label>Status</label>
                      <select
                        name="status"
                        value={newsletterFormData.status}
                        onChange={handleNewsletterInputChange}
                        required
                        disabled={newsletterFormData.status === "Sent"} 
                      >
                        {newsletterFormData.status === "Sent" ? (
                          
                          <option value="Sent">Sent</option>
                        ) : (
                          <>
                            <option value="Draft">Draft</option>
                            <option value="Canceled">Canceled</option>
                          </>
                        )}
                      </select>
                    </div>

                    
                    {/* {newsletterFormData.status === 'scheduled' && (
                      <div className="form-group-nl">
                        <label>Schedule For</label>
                        <input
                          type="datetime-local"
                          name="scheduledFor"
                          value={newsletterFormData.scheduledFor}
                          onChange={handleNewsletterInputChange}
                          required={newsletterFormData.status === 'scheduled'}
                        />
                      </div>
                    )} */}
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