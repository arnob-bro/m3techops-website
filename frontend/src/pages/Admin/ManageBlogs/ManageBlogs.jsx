import { useState, useEffect } from 'react';
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import Modal from 'react-modal';
import './ManageBlogs.css';

const ManageBlog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    excerpt: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    author: {
      name: '',
      avatar: '',
      role: ''
    },
    active: true
  });

  useEffect(() => {
    // Set up modal app element for react-modal
    Modal.setAppElement('#root');
    
    // Fetch blog posts from API
    const fetchBlogPosts = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockBlogPosts = [
          {
            id: '1',
            title: "The Future of Web Development in 2023",
            excerpt: "Exploring the latest trends and technologies shaping web development this year.",
            content: "<h2>Introduction</h2><p>As we move further into 2023, the web development landscape continues to evolve...</p>",
            category: "Web Development",
            date: "2023-06-15",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "Alex Johnson",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              role: "Senior Web Developer"
            },
            active: true
          },
          {
            id: '2',
            title: "Mobile App Security Best Practices",
            excerpt: "Essential security measures every mobile app developer should implement.",
            content: "<h2>The Importance of Mobile Security</h2><p>With mobile devices becoming the primary computing platform...</p>",
            category: "Mobile Development",
            date: "2023-05-28",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "Sarah Chen",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              role: "Mobile Security Specialist"
            },
            active: true
          },
          {
            id: '3',
            title: "Cloud Computing: Cost Optimization Strategies",
            excerpt: "How to maximize your cloud investment while minimizing expenses.",
            content: "<h2>The Cloud Cost Challenge</h2><p>While cloud computing offers numerous benefits, costs can quickly spiral...</p>",
            category: "Cloud Solutions",
            date: "2023-04-10",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "Michael Rodriguez",
              avatar: "https://randomuser.me/api/portraits/men/75.jpg",
              role: "Cloud Architect"
            },
            active: false
          }
        ];
        setBlogPosts(mockBlogPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  // Handle modal open/close body scroll lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
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

  const handleAuthorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      author: {
        ...prev.author,
        [name]: value
      }
    }));
  };

  const handleToggleActive = (id) => {
    setBlogPosts(blogPosts.map(post => 
      post.id === id ? { ...post, active: !post.active } : post
    ));
    // Here you would also update the post status in your backend
  };

  const openEditModal = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      date: post.date,
      readTime: post.readTime,
      author: {
        name: post.author.name,
        avatar: post.author.avatar,
        role: post.author.role
      },
      active: post.active
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentPost(null);
    setFormData({
      title: '',
      category: 'Web Development',
      excerpt: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      author: {
        name: '',
        avatar: '',
        role: ''
      },
      active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentPost) {
      // Update existing post
      setBlogPosts(blogPosts.map(post => 
        post.id === currentPost.id ? { ...post, ...formData } : post
      ));
    } else {
      // Add new post
      const newPost = {
        id: Date.now().toString(),
        ...formData
      };
      setBlogPosts([...blogPosts, newPost]);
    }
    setIsModalOpen(false);
  };

  const deletePost = (id) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
    // Here you would also delete the post from your backend
  };

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="manage-blog">
      <div className="blog-header">
        <h2>Manage Blog Posts</h2>
        <div className="blog-header-actions">
          <div className="blog-search">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button onClick={openAddModal} className="blog-btn-add">
            <FaPlus size={16} />
            Add New Post
          </button>
        </div>
      </div>

      <div className="blog-table-container">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Author</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <tr key={post.id} className={post.active ? '' : 'inactive'}>
                  <td>
                    <div className="post-title-cell">
                      {post.image && (
                        <img src={post.image} alt={post.title} className="post-thumbnail" />
                      )}
                      <div>
                        <h4>{post.title}</h4>
                        <p className="post-excerpt">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-tag">{post.category}</span>
                  </td>
                  <td>{formatDate(post.date)}</td>
                  <td>
                    <div className="author-cell">
                      {post.author.avatar && (
                        <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                      )}
                      <span>{post.author.name}</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleToggleActive(post.id)} 
                      className={`status-btn ${post.active ? 'active' : 'inactive'}`}
                    >
                      {post.active ? (
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
                      <button 
                        onClick={() => openEditModal(post)} 
                        className="edit-btn"
                        aria-label="Edit post"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => deletePost(post.id)} 
                        className="delete-btn"
                        aria-label="Delete post"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-results">
                <td colSpan="6">
                  No blog posts found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="blog-modal"
        overlayClassName="blog-modal-overlay"
      >
        <div className="blog-modal-content">
          <div className="blog-modal-header">
            <h3>{currentPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="blog-modal-close"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          
          <div className="blog-modal-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Cloud Solutions">Cloud Solutions</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Custom Software">Custom Software</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Short description for blog listing"
                    required
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Full blog post content (HTML allowed)"
                    required
                    rows="8"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Featured Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Enter image URL"
                    required
                  />
                  {formData.image && (
                    <div className="image-preview">
                      <img src={formData.image} alt="Preview" />
                      <span>Preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Publish Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 5 min read"
                    required
                  />
                </div>
              </div>

              <div className="form-section-title">Author Information</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Author Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.author.name}
                    onChange={handleAuthorChange}
                    placeholder="Author's full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Author Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.author.role}
                    onChange={handleAuthorChange}
                    placeholder="Author's role/position"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author Avatar URL</label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.author.avatar}
                    onChange={handleAuthorChange}
                    placeholder="Enter avatar image URL"
                    required
                  />
                  {formData.author.avatar && (
                    <div className="avatar-preview">
                      <img src={formData.author.avatar} alt="Author preview" />
                      <span>Preview</span>
                    </div>
                  )}
                </div>
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {currentPost ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageBlog;