import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import './Blog.css';
import BlogApi from '../../apis/blogApi';
const blogApi = new BlogApi();

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;


  const fetchBlogs = async () => {
    try {
      

      const res = await blogApi.getBlogs({
        page: page,
        limit: limit,
        title: searchTerm,
        active: true
      });
      const blogs = res.data?.blogs;
      
      setBlogs(blogs);
      setTotalPages(res.data?.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchBlogs();
  }, [searchTerm,page]);


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <motion.div 
            className="blog-hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Tech Insights & News</h1>
            <p>Stay updated with the latest trends, technologies, and best practices in the tech industry.</p>
          </motion.div>
        </div>
      </section>

      <section className="blog-main">
        <div className="container">
          <motion.div 
            className="blog-search"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <input 
              type="text" 
              placeholder="Search articles by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>

          {loading ? (
            <div className="blog-loading">
              {[...Array(3)].map((_, index) => (
                <motion.div 
                  key={index}
                  className="blog-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line medium"></div>
                    <div className="skeleton-line long"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="blog-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <motion.article 
                    key={blog.blog_id}
                    className="blog-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
                  >
                    <Link 
                      to={`/blog/${blog.blog_id}`} 
                      className="blog-card-link"
                      onClick={() => {
                        // Small delay to ensure navigation happens first
                        setTimeout(() => {
                          window.scrollTo(0, 0);
                        }, 100);
                      }}
                    >
                      <div className="blog-card-image">
                        <img src={blog.image} alt={blog.title} />
                        <div className="blog-category">{blog.category}</div>
                      </div>
                      <div className="blog-card-content">
                        <div className="blog-meta">
                          <span className="blog-date">{formatDate(blog.date)}</span>
                          <span className="blog-read-time">{blog.read_time}</span>
                        </div>
                        <h3 className="blog-title-header">{blog.title}</h3>
                        <p className="blog-excerpt">{blog.excerpt}</p>
                        <div className="blog-read-more">
                          Read Article
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))
              ) : (
                <div className="blog-empty">
                  <h3>No articles found matching your search</h3>
                  <p>Try adjusting your search or browse our categories</p>
                </div>
              )}
            </motion.div>
          )}
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
      </section>
    </div>
  );
};

export default Blog;