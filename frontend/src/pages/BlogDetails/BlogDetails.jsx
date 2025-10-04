import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import './BlogDetails.css';
import BlogApi from '../../apis/blogApi';
import NewsLetterApi from '../../apis/newsLetterApi';
const newsLetterApi = new  NewsLetterApi();
const blogApi = new BlogApi();

const BlogDetails = () => {
  const [email, setEmail] = useState();
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  
  const handleSubmitSubscription = async () => {
    const res = await newsLetterApi.subscribe(email);
    setEmail("");
  }

  const fetchBlogDetails = async () => {
    try {
      const res = await blogApi.getBlogById(blog_id);
      const blog = res.blog;
      const res2 = await blogApi.getBlogs({
        page: 1,
        limit: 10,
        title: '',
        active: true
      });
      const blogs = res2.data?.blogs;

      
      if (blog) {
        setBlog(blog);
        
        // Simulate fetching related blogs (same category)
        const related = blogs
          .filter(b => b.category === blog.category && b.blog_id !== blog.blog_id)
          .slice(0, 3);
        setRelatedBlogs(related);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchBlogDetails();
  }, [blog_id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="blog-details-loading">
        <div className="container">
          <div className="loading-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-not-found">
        <div className="container">
          <motion.div 
            className="not-found-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Article Not Found</h2>
            <p>The article you're looking for doesn't exist or may have been removed.</p>
            <Link to="/blog" className="btn btn-primary">
              Back to Blog
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-details">
      <motion.article 
        className="blog-post"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <motion.header 
            className="blog-post-header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="blog-meta">
              <span className="blog-details-category">{blog.category}</span>
              <span className="blog-date">{formatDate(blog.date)}</span>
              <span className="blog-read-time">{blog.read_time}</span>
            </div>
            <h1 className="blog-title">{blog.title}</h1>
          </motion.header>

          <motion.div 
            className="blog-post-image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <img src={blog.image} alt={blog.title} />
          </motion.div>

          <motion.div 
            className="blog-post-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <motion.div 
            className="blog-post-author"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="author-image">
              <img src={blog.author_avatar} alt={blog.author_name} />
            </div>
            <div className="author-info">
              <h4>Written by {blog.author_name}</h4>
              <p>{blog.author_role}</p>
            </div>
          </motion.div>
        </div>
      </motion.article>

      {relatedBlogs.length > 0 && (
        <section className="related-blogs">
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Related Articles
            </motion.h2>
            
            <motion.div 
              className="related-blogs-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {relatedBlogs.map((relatedBlog) => (
                <motion.div 
                  key={relatedBlog.blog_id}
                  className="related-blog-card"
                  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                >
                  <Link to={`/blog/${relatedBlog.blog_id}`} className="related-blog-link">
                    <div className="related-blog-image">
                      <img src={relatedBlog.image} alt={relatedBlog.title} />
                    </div>
                    <div className="related-blog-content">
                      <h3>{relatedBlog.title}</h3>
                      <div className="related-blog-meta">
                        <span>{formatDate(relatedBlog.date)}</span>
                        <span>{relatedBlog.read_time}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section className="blog-cta">
        <div className="container">
          <motion.div 
            className="blog-cta-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2>Want more insights like this?</h2>
            <p>Subscribe to our newsletter to stay updated with the latest tech trends and company news.</p>
            <div className="blog-cta-form">
              <input 
              type="email" 
              name="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              placeholder="Enter your email"
              />
              <button className="btn btn-primary"
              onClick={handleSubmitSubscription}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;