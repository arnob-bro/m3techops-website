import { useState, useEffect } from 'react';
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Modal from 'react-modal';
import './ManageBlogs.css';
import ServiceApi from "../../../apis/serviceApi";
import BlogApi from "../../../apis/blogApi";

const serviceApi = new ServiceApi();
const blogApi = new BlogApi();

const ManageBlog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: "",
    date: new Date().toISOString().split('T')[0],
    read_time: '5 min read',
    author_name: "",
    author_avatar: "",
    author_role: "",
    active: true
  });
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 10;

  
  const fetchCategories = async () => {
    try {
      const res = await serviceApi.getServices(); 
      const services = res.services;
      setCategories(services);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };


  const fetchBlogPosts = async () => {
    try {

      const res = await blogApi.getBlogs({
        page: page,
        limit: limit,
        title: searchTerm,
        active: statusFilter
      });
      const blogs = res.data?.blogs;
      setBlogPosts(blogs);
      setTotalPages(res.data?.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };


  useEffect(() => {
    // Set up modal app element for react-modal
    Modal.setAppElement('#root');

    fetchCategories();
    fetchBlogPosts();
  }, [page, searchTerm, statusFilter]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, author_avatar: file });
      setPreviewAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleToggleActive = async (blog_id) => {
    try {
      
      setBlogPosts(blogPosts.map(post =>
        post.blog_id === blog_id ? { ...post, active: !post.active } : post
      ));
      await blogApi.toggleActive(blog_id);
  
    } catch (error) {
      console.error("Error updating blog status:", error);
  
      // Revert UI change if backend update fails
      setBlogPosts(blogPosts.map(post =>
        post.blog_id === blog_id ? { ...post, active: !post.active } : post
      ));
    }
  };

  const openEditModal = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      date: new Date(post.date).toISOString().split("T")[0],
      read_time: post.read_time,
      author_name: post.author_name,
      author_avatar: post.author_avatar,
      author_role: post.author_role,
      active: post.active
    });
    setPreviewUrl(post.image);
    setPreviewAvatarUrl(post.author_avatar);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentPost(null);
    setFormData({
      title: "",
      category: "",
      excerpt: "",
      content: "",
      image: "",
      date: new Date().toISOString().split('T')[0],
      read_time: "",
      author_name: "",
      author_avatar: "",
      author_role: "",
      active: true
    });
    setPreviewUrl(null);
    setPreviewAvatarUrl(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (currentPost) {
        // Update existing post
        const res = await blogApi.updateBlog(currentPost.blog_id, formData);
        const updatedBlog = res.blog; // assuming backend returns the updated blog
        setBlogPosts(blogPosts.map(post => 
          post.blog_id === currentPost.blog_id ? updatedBlog : post
        ));
      } else {
        // Add new post
        const res = await blogApi.createBlog(formData);
        const newBlog = res.blog; // backend returns the created blog with blog_id
        setBlogPosts([...blogPosts, newBlog]);
      }
      setIsModalOpen(false);
      setPreviewUrl(null);
      setPreviewAvatarUrl(null);
    } catch (error) {
      console.error("Error saving blog post:", error);
    }
  };
  

  // const deletePost = (blog_id) => {
  //   setBlogPosts(blogPosts.filter(post => post.blog_id !== blog_id));
  //   // Here you would also delete the post from your backend
  // };

  // const filteredPosts = blogPosts.filter(post => 
  //   post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   post.category.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
              placeholder="Search posts by title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);

              }}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="blog-filters">
              <select 
                value={statusFilter} 
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value= {true} >Active</option>
                <option value={false}>Inactive</option>
              </select>
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
            {blogPosts.length > 0 ? (
              blogPosts.map(post => (
                <tr key={post.blog_id} className={post.active ? '' : 'inactive'}>
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
                      {post.author_avatar && (
                        <img src={post.author_avatar} alt={post.author_name} className="author-avatar" />
                      )}
                      <span>{post.author_name}</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleToggleActive(post.blog_id)} 
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
                      <FaEdit 
                        onClick={() => openEditModal(post)} 
                        className="edit-icon"
                        aria-label="Edit post"
                      />
                      {/* <FaTrash 
                        onClick={() => deletePost(post.blog_id)} 
                        className="delete-icon"
                        aria-label="Delete post"
                      /> */}
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
        {totalPages > 1 && (
                <div className="pagination">
                {/* Previous */}
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  <FiChevronLeft /> Previous
                </button>
              
                {/* Page numbers with ellipsis */}
                {(() => {
                  const pages = [];
                  const delta = 1; // show ±1 around current
              
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
              
                  return pages.map((page, idx) =>
                    page === '...' ? (
                      <span key={idx} className="pagination-ellipsis">…</span>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => setPage(page)}
                        className={page === page ? 'active' : ''}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}
              
                {/* Next */}
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
        onRequestClose={() => {
          setPreviewUrl(null);
          setIsModalOpen(false);
        }}
        className="blog-modal"
        overlayClassName="blog-modal-overlay"
      >
        <div className="blog-modal-content">
          <div className="blog-modal-header">
            <h3>{currentPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
            <button 
              onClick={() => {
                setPreviewUrl(null);
                setIsModalOpen(false);
              }} 
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
                      <option value="">-- Select Category --</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.title}>
                          {cat.title}
                        </option>
                      ))}
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
                  <label>Content Preview</label>
                  <div
                    style={{ border: '1px solid #ccc', padding: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Featured Image</label>
                  <input 
                    type="file" 
                    id="image"
                    name="image" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    required={!currentPost}
                  />
                  {formData.image && (
                    <div className="image-preview">
                      <img src={previewUrl} alt="Preview" />
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
                    name="read_time"
                    value={formData.read_time}
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
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleInputChange}
                    placeholder="Author's full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Author Role</label>
                  <input
                    type="text"
                    name="author_role"
                    value={formData.author_role}
                    onChange={handleInputChange}
                    placeholder="Author's role/position"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author Avatar</label>
                  <input 
                    type="file" 
                    id="image"
                    name="image" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    required={!currentPost}
                  />
                  {formData.author_avatar && (
                    <div className="avatar-preview">
                      <img src={previewAvatarUrl} alt="Author preview" />
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
                <button type="button" onClick={() => {
                  setPreviewUrl(null);
                  setIsModalOpen(false);
                }}
                   className="cancel-btn">
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