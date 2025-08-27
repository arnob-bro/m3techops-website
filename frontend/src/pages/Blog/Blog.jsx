import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API fetch
    const fetchBlogs = async () => {
      try {
        // In a real app, you would fetch from your backend API
        const mockBlogs = [
          {
            id: 1,
            title: "The Future of Web Development in 2023",
            excerpt: "Exploring the latest trends and technologies shaping web development this year.",
            category: "Web Development",
            date: "June 15, 2023",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 2,
            title: "Mobile App Security Best Practices",
            excerpt: "Essential security measures every mobile app developer should implement.",
            category: "Mobile Development",
            date: "May 28, 2023",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 3,
            title: "Cloud Computing: Cost Optimization Strategies",
            excerpt: "How to maximize your cloud investment while minimizing expenses.",
            category: "Cloud Solutions",
            date: "April 10, 2023",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 4,
            title: "AI in Business: Practical Applications",
            excerpt: "Real-world examples of how AI is transforming various industries.",
            category: "AI & Automation",
            date: "March 22, 2023",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1677442135136-760c813cd6d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 5,
            title: "The Rise of Low-Code Development Platforms",
            excerpt: "How low-code platforms are democratizing software development.",
            category: "Custom Software",
            date: "February 18, 2023",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 6,
            title: "Progressive Web Apps: The Best of Both Worlds",
            excerpt: "Why PWAs are becoming the preferred choice for many businesses.",
            category: "Web Development",
            date: "January 5, 2023",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          }
        ];
        
        setBlogs(mockBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Search articles..." 
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
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => (
                  <motion.article 
                    key={blog.id}
                    className="blog-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
                  >
                    <Link to={`/blog/${blog.id}`} className="blog-card-link">
                      <div className="blog-card-image">
                        <img src={blog.image} alt={blog.title} />
                        <div className="blog-category">{blog.category}</div>
                      </div>
                      <div className="blog-card-content">
                        <div className="blog-meta">
                          <span className="blog-date">{blog.date}</span>
                          <span className="blog-read-time">{blog.readTime}</span>
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
        </div>
      </section>
    </div>
  );
};

export default Blog;