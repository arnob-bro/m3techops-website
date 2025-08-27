import { useState, useEffect } from 'react';
import { FiMail, FiClock, FiSearch, FiEye, FiTrash2, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ManageContact.css';

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const messagesPerPage = 10;

  // Simulated data - replace with actual API call
  useEffect(() => {
    const mockMessages = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'TechCorp',
        jobTitle: 'CTO',
        phone: '+1 (555) 123-4567',
        country: 'US',
        message: 'I am interested in your web development services for our new project. Can we schedule a call to discuss this further?',
        date: '2023-06-15T14:30:00Z',
        read: true
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@example.com',
        company: 'StartUp Inc',
        jobTitle: 'Product Manager',
        phone: '+1 (555) 987-6543',
        country: 'CA',
        message: 'We are looking for a mobile app development partner for our healthcare startup. Please send me more information about your process and pricing.',
        date: '2023-06-14T09:15:00Z',
        read: false
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@example.com',
        company: 'Enterprise Solutions',
        jobTitle: 'IT Director',
        phone: '+1 (555) 456-7890',
        country: 'UK',
        message: 'We need assistance with cloud migration for our infrastructure. What experience does your team have with AWS and Azure?',
        date: '2023-06-13T16:45:00Z',
        read: true
      },
      {
        id: '4',
        firstName: 'Emma',
        lastName: 'Williams',
        email: 'emma.w@example.com',
        company: 'Creative Agency',
        jobTitle: 'Creative Director',
        phone: '+44 20 7946 0958',
        country: 'UK',
        message: 'Love your portfolio! We are looking for a UI/UX designer to join our team on a contract basis. Are you available for freelance work?',
        date: '2023-06-12T11:20:00Z',
        read: false
      },
      {
        id: '5',
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@example.com',
        company: 'E-commerce Ventures',
        jobTitle: 'CEO',
        phone: '+82 2 1234 5678',
        country: 'Other',
        message: 'We need to rebuild our e-commerce platform from scratch. Can you provide a proposal with timeline and cost estimates?',
        date: '2023-06-11T08:05:00Z',
        read: true
      },
      {
        id: '6',
        firstName: 'Lisa',
        lastName: 'Rodriguez',
        email: 'lisa.r@example.com',
        company: 'Nonprofit Org',
        jobTitle: 'Operations Manager',
        phone: '+1 (555) 234-5678',
        country: 'US',
        message: 'We are a nonprofit looking for pro bono or discounted web development services for our community platform. Is this something you offer?',
        date: '2023-06-10T13:40:00Z',
        read: false
      },
      {
        id: '7',
        firstName: 'Robert',
        lastName: 'Taylor',
        email: 'robert.t@example.com',
        company: 'Finance Corp',
        jobTitle: 'VP of Technology',
        phone: '+1 (555) 876-5432',
        country: 'US',
        message: 'Interested in your custom software development services for our financial analytics platform. What security certifications does your team hold?',
        date: '2023-06-09T15:25:00Z',
        read: true
      },
      {
        id: '8',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.g@example.com',
        company: 'Healthcare Solutions',
        jobTitle: 'IT Manager',
        phone: '+1 (555) 345-6789',
        country: 'US',
        message: 'We need HIPAA compliant software development for our patient portal. Do you have experience with healthcare regulations?',
        date: '2023-06-08T10:10:00Z',
        read: false
      },
      {
        id: '9',
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.w@example.com',
        company: 'Education Tech',
        jobTitle: 'Founder',
        phone: '+1 (555) 765-4321',
        country: 'CA',
        message: 'We are building an edtech platform and need a development team that understands the education sector. Can we discuss your approach?',
        date: '2023-06-07T12:55:00Z',
        read: true
      },
      {
        id: '10',
        firstName: 'Jennifer',
        lastName: 'Brown',
        email: 'jennifer.b@example.com',
        company: 'Retail Innovations',
        jobTitle: 'Marketing Director',
        phone: '+1 (555) 654-3210',
        country: 'US',
        message: 'Looking for a team to develop a mobile shopping app with AR features. Do you have experience with augmented reality development?',
        date: '2023-06-06T09:30:00Z',
        read: true
      },
      {
        id: '11',
        firstName: 'Thomas',
        lastName: 'Anderson',
        email: 'thomas.a@example.com',
        company: 'Gaming Studio',
        jobTitle: 'Game Director',
        phone: '+1 (555) 432-1098',
        country: 'US',
        message: 'We need backend development for our multiplayer game. What is your experience with real-time databases and socket programming?',
        date: '2023-06-05T14:15:00Z',
        read: false
      },
      {
        id: '12',
        firstName: 'Sophia',
        lastName: 'Martinez',
        email: 'sophia.m@example.com',
        company: 'Media Company',
        jobTitle: 'Content Manager',
        phone: '+1 (555) 321-0987',
        country: 'US',
        message: 'We need a complete redesign of our content management system. Can you provide examples of similar projects you have completed?',
        date: '2023-06-04T11:50:00Z',
        read: true
      }
    ];
    
    setMessages(mockMessages);
    setFilteredMessages(mockMessages);
  }, []);

  // Filter messages based on search term and status filter
  useEffect(() => {
    let result = messages;
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(msg => 
        msg.firstName.toLowerCase().includes(lowerSearch) ||
        msg.lastName.toLowerCase().includes(lowerSearch) ||
        msg.email.toLowerCase().includes(lowerSearch) ||
        msg.company.toLowerCase().includes(lowerSearch) ||
        msg.message.toLowerCase().includes(lowerSearch)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(msg => 
        statusFilter === 'read' ? msg.read : !msg.read
      );
    }
    
    setFilteredMessages(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, messages]);

  // Calculate pagination
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const viewMessage = (message) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);
    
    // Mark as read
    if (!message.read) {
      setMessages(messages.map(msg => 
        msg.id === message.id ? { ...msg, read: true } : msg
      ));
    }
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCountryName = (code) => {
    const countries = {
      US: 'United States',
      CA: 'Canada',
      UK: 'United Kingdom',
      AU: 'Australia',
      IN: 'India',
      DE: 'Germany',
      FR: 'France',
      JP: 'Japan',
      Other: 'Other'
    };
    return countries[code] || code;
  };

  return (
    <div className="manage-contact">
      <div className="contact-header">
        <h2>Contact Messages</h2>
        <p>Manage and respond to inquiries from your contact form</p>
      </div>

      <div className="contact-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <FiFilter className="filter-icon" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
      </div>

      <div className="messages-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FiMail />
          </div>
          <div className="stat-info">
            <h3>{messages.length}</h3>
            <p>Total Messages</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon unread">
            <FiMail />
          </div>
          <div className="stat-info">
            <h3>{messages.filter(m => !m.read).length}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
      </div>

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
            {currentMessages.length > 0 ? (
              currentMessages.map(message => (
                <tr key={message.id} className={message.read ? '' : 'unread'}>
                  <td>
                    <div className="user-info">
                      <div className="avatar">
                        {message.firstName.charAt(0)}{message.lastName.charAt(0)}
                      </div>
                      <div className="name">
                        {message.firstName} {message.lastName}
                        {message.jobTitle && <span className="job-title">{message.jobTitle}</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${message.email}`} className="email-link">
                      {message.email}
                    </a>
                  </td>
                  <td>
                    {message.company || '-'}
                  </td>
                  <td>
                    <div className="message-preview">
                      {message.message.length > 100 
                        ? `${message.message.substring(0, 100)}...` 
                        : message.message
                      }
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FiClock />
                      {formatDate(message.date)}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${message.read ? 'read' : 'unread'}`}>
                      {message.read ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => viewMessage(message)} 
                        className="view-btn"
                        aria-label="View message"
                      >
                        <FiEye />
                      </button>
                      <button 
                        onClick={() => deleteMessage(message.id)} 
                        className="delete-btn"
                        aria-label="Delete message"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan="7">
                  No messages found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredMessages.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <FiChevronLeft />
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? 'active' : ''}
              >
                {number}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
            <FiChevronRight />
          </button>
        </div>
      )}

      {/* View Message Modal */}
      {isViewModalOpen && selectedMessage && (
        <div className="modal-overlay">
          <div className="message-modal">
            <div className="modal-header">
              <h3>Message from {selectedMessage.firstName} {selectedMessage.lastName}</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="modal-close"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            
            <div className="modal-content">
              <div className="message-details">
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="detail-value">
                    {selectedMessage.email}
                  </a>
                </div>
                
                {selectedMessage.phone && (
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedMessage.phone}</span>
                  </div>
                )}
                
                {selectedMessage.company && (
                  <div className="detail-row">
                    <span className="detail-label">Company:</span>
                    <span className="detail-value">{selectedMessage.company}</span>
                  </div>
                )}
                
                {selectedMessage.jobTitle && (
                  <div className="detail-row">
                    <span className="detail-label">Job Title:</span>
                    <span className="detail-value">{selectedMessage.jobTitle}</span>
                  </div>
                )}
                
                {selectedMessage.country && (
                  <div className="detail-row">
                    <span className="detail-label">Country:</span>
                    <span className="detail-value">{getCountryName(selectedMessage.country)}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(selectedMessage.date)}</span>
                </div>
              </div>
              
              <div className="message-content">
                <h4>Message</h4>
                <p>{selectedMessage.message}</p>
              </div>
            </div>
            
            <div className="modal-actions">
              <a 
                href={`mailto:${selectedMessage.email}?subject=Re: Your inquiry`} 
                className="reply-btn"
              >
                Reply via Email
              </a>
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