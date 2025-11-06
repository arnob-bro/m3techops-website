import { useState, useEffect } from 'react';
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Modal from 'react-modal';
import './ManageCareer.css';
import CareerApi from "../../../apis/careerApi";

const careerApi = new CareerApi();

const ManageCareer = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    vacancies: 1,
    description: "",
    requirements: [""],
    active: true
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 10;

  const fetchJobPostings = async () => {
    try {
      const res = await careerApi.getJobs({
        page: page,
        limit: limit,
        title: searchTerm,
        active: statusFilter
      });
      const jobs = res.data?.jobs || [];
      setJobPostings(jobs);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
  };

  useEffect(() => {
    Modal.setAppElement('#root');
    fetchJobPostings();
  }, [page, searchTerm, statusFilter]);

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

  const handleToggleActive = async (job_id) => {
    try {
      setJobPostings(jobPostings.map(job =>
        job.job_id === job_id ? { ...job, active: !job.active } : job
      ));
      await careerApi.toggleActive(job_id);
    } catch (error) {
      console.error("Error updating job status:", error);
      setJobPostings(jobPostings.map(job =>
        job.job_id === job_id ? { ...job, active: !job.active } : job
      ));
    }
  };

  const openEditModal = (job) => {
    setCurrentJob(job);
    setFormData({
      title: job.title,
      deadline: job.deadline,
      vacancies: job.vacancies,
      description: job.description,
      requirements: [...job.requirements],
      active: job.active
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentJob(null);
    setFormData({
      title: "",
      deadline: "",
      vacancies: 1,
      description: "",
      requirements: [""],
      active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const filteredRequirements = formData.requirements.filter(req => req.trim() !== "");
      
      const submitData = {
        ...formData,
        requirements: filteredRequirements
      };

      if (currentJob) {
        const res = await careerApi.updateJob(currentJob.job_id, submitData);
        // Refetch data to ensure UI is updated with new deadline status
        await fetchJobPostings();
      } else {
        const res = await careerApi.createJob(submitData);
        // Refetch data to include the new job
        await fetchJobPostings();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving job posting:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fixed deadline checking function
  const isDeadlinePassed = (deadline) => {
    if (!deadline) return true;
    
    // Create dates at start of day for fair comparison (ignore time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    return deadlineDate < today;
  };

  // Component for deadline status that updates dynamically
  const DeadlineStatus = ({ deadline }) => {
    const [isExpired, setIsExpired] = useState(isDeadlinePassed(deadline));

    // Update status when deadline changes
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="career-filters">
            <select 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
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
              <th>Deadline</th>
              <th>Vacancies</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobPostings.length > 0 ? (
              jobPostings.map(job => (
                <tr key={job.job_id} className={job.active ? '' : 'inactive'}>
                  <td>
                    <div className="job-title-cell">
                      <div>
                        <h4>{job.title}</h4>
                        <p className="job-description">{job.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <DeadlineStatus deadline={job.deadline} />
                  </td>
                  <td>
                    <span className="vacancies-badge">{job.vacancies} {job.vacancies === 1 ? 'Position' : 'Positions'}</span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleToggleActive(job.job_id)} 
                      className={`status-btn ${job.active ? 'active' : 'inactive'}`}
                    >
                      {job.active ? (
                        <>
                          <FaToggleOn /> Active
                        </>
                      ) : (
                        <>
                          <FaToggleOff /> Inactive
                        </>
                      )}
                    </button>
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
                <td colSpan="5">
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
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates for new jobs
                  />
                  {currentJob && isDeadlinePassed(formData.deadline) && (
                    <div className="deadline-warning">
                      Warning: This deadline has passed. Extending it will make the job ongoing again.
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
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

              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                />
                <label htmlFor="active">Active (visible to users)</label>
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