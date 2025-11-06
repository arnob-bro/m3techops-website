import { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Modal from 'react-modal';
import './ManageCareer.css';

// Mock data
const MOCK_JOBS = [
  {
    job_id: 1,
    title: "Senior Frontend Developer",
    posted_date: "2025-10-15",
    deadline: "2025-11-30",
    vacancies: 2,
    description: "We are looking for an experienced frontend developer with expertise in React and modern web technologies.",
    requirements: [
      "5+ years of React experience",
      "Strong TypeScript skills",
      "Experience with state management"
    ],
    status: "Open"
  },
  {
    job_id: 2,
    title: "UX/UI Designer",
    posted_date: "2025-09-10",
    deadline: "2025-10-15",
    vacancies: 1,
    description: "Creative designer needed to lead our design initiatives and create exceptional user experiences.",
    requirements: [
      "3+ years of UI/UX design",
      "Figma proficiency",
      "Portfolio required"
    ],
    status: "Closed"
  },
  {
    job_id: 3,
    title: "Backend Engineer",
    posted_date: "2025-11-01",
    deadline: "2025-12-15",
    vacancies: 3,
    description: "Join our backend team to build scalable and efficient server-side applications.",
    requirements: [
      "Node.js experience",
      "Database design skills",
      "API development"
    ],
    status: "Draft"
  },
  {
    job_id: 4,
    title: "DevOps Engineer",
    posted_date: "2025-08-20",
    deadline: "2025-09-20",
    vacancies: 1,
    description: "Looking for a DevOps engineer to manage our cloud infrastructure and CI/CD pipelines.",
    requirements: [
      "AWS/Azure experience",
      "Docker and Kubernetes",
      "CI/CD pipeline setup"
    ],
    status: "Cancelled"
  },
  {
    job_id: 5,
    title: "Product Manager",
    posted_date: "2025-10-20",
    deadline: "2025-11-25",
    vacancies: 1,
    description: "Strategic product manager to drive product vision and coordinate cross-functional teams.",
    requirements: [
      "5+ years product management",
      "Agile methodology",
      "Stakeholder management"
    ],
    status: "Open"
  }
];

const ManageCareer = () => {
  const [jobPostings, setJobPostings] = useState(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState(MOCK_JOBS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    posted_date: "",
    deadline: "",
    vacancies: 1,
    description: "",
    requirements: [""],
    status: "Draft"
  });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 10;

  const totalPages = Math.ceil(filteredJobs.length / limit);
  const paginatedJobs = filteredJobs.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    // Filter jobs based on search and status
    let filtered = jobPostings;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
    setPage(1);
  }, [searchTerm, statusFilter, jobPostings]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        requirements: newRequirements
      }));
    }
  };

  const openEditModal = (job) => {
    setCurrentJob(job);
    setFormData({
      title: job.title,
      posted_date: job.posted_date,
      deadline: job.deadline,
      vacancies: job.vacancies,
      description: job.description,
      requirements: [...job.requirements],
      status: job.status
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentJob(null);
    setFormData({
      title: "",
      posted_date: new Date().toISOString().split('T')[0],
      deadline: "",
      vacancies: 1,
      description: "",
      requirements: [""],
      status: "Draft"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredRequirements = formData.requirements.filter(req => req.trim() !== "");

    const submitData = {
      ...formData,
      requirements: filteredRequirements
    };

    if (currentJob) {
      // Update existing job
      setJobPostings(prev =>
        prev.map(job =>
          job.job_id === currentJob.job_id
            ? { ...job, ...submitData }
            : job
        )
      );
    } else {
      // Add new job
      const newJob = {
        job_id: Math.max(...jobPostings.map(j => j.job_id), 0) + 1,
        ...submitData
      };
      setJobPostings(prev => [...prev, newJob]);
    }

    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    return deadlineDate < today;
  };

  const DeadlineStatus = ({ deadline }) => {
    const [isExpired, setIsExpired] = useState(isDeadlinePassed(deadline));

    useEffect(() => {
      setIsExpired(isDeadlinePassed(deadline));
    }, [deadline]);

    return (
      <div className={`deadline-cell ${isExpired ? 'expired' : 'ongoing'}`}>
        {formatDate(deadline)}
        {isExpired ? (
          <span className="expired-badge">Expired</span>
        ) : (
          <span className="ongoing-badge">Ongoing</span>
        )}
      </div>
    );
  };

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase()}`;
  };

  return (
    <div className="manage-career">
      <div className="career-header">
        <h2>Manage Job Postings</h2>
        <div className="career-header-actions">
          <div className="career-search">
            <input
              type="text"
              placeholder="Search jobs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="career-filters">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button onClick={openAddModal} className="career-btn-add">
            <FaPlus size={16} />
            Add New Job
          </button>
        </div>
      </div>

      <div className="career-table-container">
        <table className="career-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Posted Date</th>
              <th>Deadline</th>
              <th>Vacancies</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map(job => (
                <tr key={job.job_id} className={getStatusClass(job.status)}>
                  <td>
                    <div className="job-title-cell">
                      <div>
                        <h4>{job.title}</h4>
                        <p className="job-description">{job.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="posted-date-cell">
                      {formatDate(job.posted_date)}
                    </div>
                  </td>
                  <td>
                    <DeadlineStatus deadline={job.deadline} />
                  </td>
                  <td>
                    <span className="vacancies-badge">
                      {job.vacancies} {job.vacancies === 1 ? 'Position' : 'Positions'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge-${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <FaEdit
                        onClick={() => openEditModal(job)}
                        className="edit-icon"
                        aria-label="Edit job"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan="6">
                  No job postings found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                if (
                  i === 1 ||
                  i === totalPages ||
                  (i >= page - delta && i <= page + delta)
                ) {
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
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="career-modal"
        overlayClassName="career-modal-overlay"
      >
        <div className="career-modal-content">
          <div className="career-modal-header">
            <h3>{currentJob ? 'Edit Job Posting' : 'Add New Job Posting'}</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="career-modal-close"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <div className="career-modal-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group-bd">
                  <label>Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter job title"
                    required
                  />
                </div>

                <div className="form-group-bd">
                  <label>Posted Date</label>
                  <input
                    type="date"
                    name="posted_date"
                    value={formData.posted_date}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    disabled={currentJob !== null}
                    className={currentJob ? "disabled-input" : ""}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-bd">
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    min={formData.posted_date || new Date().toISOString().split('T')[0]}
                  />
                  {currentJob && isDeadlinePassed(currentJob.deadline) && formData.deadline !== currentJob.deadline && (
                    <div className="deadline-warning">
                      Warning: Extending the deadline will make the job ongoing again.
                    </div>
                  )}
                </div>

                <div className="form-group-bd">
                  <label>Number of Vacancies</label>
                  <input
                    type="number"
                    name="vacancies"
                    value={formData.vacancies}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-bd">
                  <label>Job Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed job description"
                    required
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-bd">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="status-select"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-section-title">Job Requirements</div>

              <div className="requirements-container">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="requirement-item">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                      className="requirement-input"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="remove-requirement-btn"
                        aria-label="Remove requirement"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="add-requirement-btn"
                >
                  + Add Requirement
                </button>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {currentJob ? 'Save Changes' : 'Create Job Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCareer;