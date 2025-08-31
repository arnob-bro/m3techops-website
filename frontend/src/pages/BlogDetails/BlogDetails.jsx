import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    // Simulate API fetch for blog details
    const fetchBlogDetails = async () => {
      try {
        // In a real app, you would fetch from your backend API using the id
        const mockBlogs = [
          {
            id: 1,
            title: "The Future of Web Development in 2023",
            content: `
              <h2>Introduction</h2>
              <p>As we move further into 2023, the web development landscape continues to evolve at a rapid pace. New technologies, frameworks, and methodologies are emerging that promise to change how we build and interact with web applications.</p>
              
              <h2>Key Trends to Watch</h2>
              <h3>1. Progressive Web Apps (PWAs)</h3>
              <p>PWAs continue to gain traction as they offer native app-like experiences directly in the browser. With improved browser support and new capabilities, they're becoming a viable alternative to traditional mobile apps.</p>
              
              <h3>2. WebAssembly (Wasm)</h3>
              <p>WebAssembly is enabling near-native performance for web applications. We're seeing more complex applications being ported to the web, including video editors, 3D modeling tools, and even games.</p>
              
              <h3>3. Serverless Architecture</h3>
              <p>The serverless paradigm is changing how we think about backend infrastructure. With platforms like AWS Lambda and Vercel, developers can focus more on business logic and less on server management.</p>
              
              <h2>Emerging Technologies</h2>
              <p>Several new technologies are worth keeping an eye on:</p>
              <ul>
                <li>Edge computing for faster content delivery</li>
                <li>Web3 and decentralized applications</li>
                <li>AI-powered development tools</li>
              </ul>
              
              <h2>Conclusion</h2>
              <p>2023 is shaping up to be an exciting year for web development. By staying informed about these trends, developers can position themselves at the forefront of the industry.</p>
            `,
            category: "Web Development",
            date: "June 15, 2023",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "Alex Johnson",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              role: "Senior Web Developer"
            }
          },
          {
            id: 2,
            title: "Mobile App Security Best Practices",
            content: `
              <h2>The Importance of Mobile Security</h2>
              <p>With mobile devices becoming the primary computing platform for many users, security has never been more critical. This article covers essential security measures every mobile app developer should implement.</p>
              
              <h2>Key Security Practices</h2>
              <h3>1. Secure Data Storage</h3>
              <p>Never store sensitive data in plain text. Use platform-specific secure storage solutions like Android's Keystore or iOS's Keychain.</p>
              
              <h3>2. Network Security</h3>
              <p>Always use HTTPS with certificate pinning to prevent man-in-the-middle attacks. Implement proper SSL/TLS configurations.</p>
              
              <h3>3. Authentication</h3>
              <p>Implement multi-factor authentication and use OAuth for third-party logins. Consider biometric authentication for sensitive operations.</p>
              
              <h2>Additional Considerations</h2>
              <ul>
                <li>Regular security audits and penetration testing</li>
                <li>Secure coding practices to prevent common vulnerabilities</li>
                <li>Timely updates to address security patches</li>
              </ul>
              
              <h2>Conclusion</h2>
              <p>Security should be a priority from day one of development. By following these best practices, you can significantly reduce the risk of security breaches in your mobile applications.</p>
            `,
            category: "Mobile Development",
            date: "May 28, 2023",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "Sarah Chen",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              role: "Mobile Security Specialist"
            }
          },
          {
            id: 3,
            title: "Cloud Computing: Cost Optimization Strategies",
            content: `
              <h2>The Cloud Cost Challenge</h2>
              <p>While cloud computing offers numerous benefits, costs can quickly spiral out of control without proper management. This article explores strategies to optimize your cloud spending.</p>
              
              <h2>Cost Optimization Techniques</h2>
              <h3>1. Right-Sizing Resources</h3>
              <p>Regularly review your resource allocations and adjust them based on actual usage patterns. Many cloud services offer tools to analyze and recommend optimal configurations.</p>
              
              <h3>2. Reserved Instances</h3>
              <p>For predictable workloads, consider purchasing reserved instances which can offer significant discounts compared to on-demand pricing.</p>
              
              <h3>3. Auto-Scaling</h3>
              <p>Implement auto-scaling to automatically adjust resources based on demand, ensuring you're not paying for idle capacity.</p>
              
              <h2>Additional Strategies</h2>
              <ul>
                <li>Implement cost allocation tags to track spending by team or project</li>
                <li>Use spot instances for fault-tolerant workloads</li>
                <li>Regularly clean up unused resources</li>
              </ul>
              
              <h2>Conclusion</h2>
              <p>Cloud cost optimization is an ongoing process. By implementing these strategies, organizations can achieve significant savings while maintaining performance and reliability.</p>
            `,
            category: "Cloud Solutions",
            date: "April 10, 2023",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "Michael Rodriguez",
              avatar: "https://randomuser.me/api/portraits/men/75.jpg",
              role: "Cloud Architect"
            }
          },
          {
            id: 4,
            title: "AI in Business: Practical Applications",
            content: `
              <h2>The AI Revolution</h2>
              <p>Artificial Intelligence is transforming businesses across industries. This article explores practical applications of AI that are delivering real value today.</p>
              
              <h2>Key Business Applications</h2>
              <h3>1. Customer Service</h3>
              <p>AI-powered chatbots and virtual assistants are handling routine customer inquiries, reducing response times and operational costs while improving customer satisfaction.</p>
              
              <h3>2. Predictive Analytics</h3>
              <p>Machine learning models are being used to forecast demand, predict equipment failures, and identify potential risks before they materialize.</p>
              
              <h3>3. Process Automation</h3>
              <p>AI is automating repetitive tasks across departments, from invoice processing in finance to resume screening in HR.</p>
              
              <h2>Industry-Specific Examples</h2>
              <ul>
                <li>Healthcare: AI-assisted diagnostics and personalized treatment plans</li>
                <li>Retail: Personalized recommendations and inventory optimization</li>
                <li>Manufacturing: Quality control and predictive maintenance</li>
              </ul>
              
              <h2>Getting Started with AI</h2>
              <p>For businesses looking to adopt AI, start with well-defined problems where data is available. Partner with experts and focus on measurable outcomes.</p>
              
              <h2>Conclusion</h2>
              <p>AI is no longer a futuristic concept but a practical tool delivering tangible business results. Organizations that strategically implement AI solutions will gain a significant competitive advantage.</p>
            `,
            category: "AI & Automation",
            date: "March 22, 2023",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1677442135136-760c813cd6d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "David Kim",
              avatar: "https://randomuser.me/api/portraits/men/22.jpg",
              role: "AI Solutions Lead"
            }
          },
          {
            id: 5,
            title: "The Rise of Low-Code Development Platforms",
            content: `
              <h2>The Low-Code Movement</h2>
              <p>Low-code platforms are democratizing software development by enabling users with varying technical skills to build applications. This article explores this growing trend.</p>
              
              <h2>Benefits of Low-Code</h2>
              <h3>1. Faster Development</h3>
              <p>Low-code platforms significantly reduce development time by providing pre-built components and visual development interfaces.</p>
              
              <h3>2. Reduced Costs</h3>
              <p>By enabling citizen developers and reducing the need for specialized coding skills, organizations can reduce development costs.</p>
              
              <h3>3. Increased Agility</h3>
              <p>Businesses can quickly adapt to changing requirements and market conditions by rapidly prototyping and iterating applications.</p>
              
              <h2>Use Cases</h2>
              <p>Low-code platforms are particularly well-suited for:</p>
              <ul>
                <li>Internal business applications</li>
                <li>Workflow automation</li>
                <li>Customer-facing portals</li>
                <li>Rapid prototyping</li>
              </ul>
              
              <h2>Limitations and Considerations</h2>
              <p>While powerful, low-code platforms may not be suitable for all scenarios. Complex, highly customized applications may still require traditional development approaches.</p>
              
              <h2>Conclusion</h2>
              <p>Low-code development is transforming how organizations build software. By combining the speed of low-code with traditional development when needed, businesses can achieve the best of both worlds.</p>
            `,
            category: "Custom Software",
            date: "February 18, 2023",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "Emily Wilson",
              avatar: "https://randomuser.me/api/portraits/women/65.jpg",
              role: "Product Manager"
            }
          },
          {
            id: 6,
            title: "Progressive Web Apps: The Best of Both Worlds",
            content: `
              <h2>What Are PWAs?</h2>
              <p>Progressive Web Apps combine the best features of web and mobile apps, offering a native app-like experience through the browser. This article explores why PWAs are gaining popularity.</p>
              
              <h2>Key Advantages</h2>
              <h3>1. Cross-Platform Compatibility</h3>
              <p>PWAs work across all devices and platforms with a single codebase, significantly reducing development and maintenance costs.</p>
              
              <h3>2. Offline Functionality</h3>
              <p>Service workers enable PWAs to work offline or with poor network connections, a capability traditionally limited to native apps.</p>
              
              <h3>3. No Installation Required</h3>
              <p>Users can access PWAs instantly without going through app stores, reducing friction and improving discoverability.</p>
              
              <h2>Technical Foundations</h2>
              <p>PWAs are built using modern web technologies:</p>
              <ul>
                <li>Service Workers for offline functionality</li>
                <li>Web App Manifest for home screen installation</li>
                <li>HTTPS for security</li>
                <li>Responsive design for all screen sizes</li>
              </ul>
              
              <h2>Success Stories</h2>
              <p>Companies like Twitter, Pinterest, and Starbucks have seen significant improvements in engagement and conversion after implementing PWAs.</p>
              
              <h2>Conclusion</h2>
              <p>For many use cases, PWAs offer a compelling alternative to traditional mobile apps. As browser support continues to improve, we can expect to see even broader adoption of this technology.</p>
            `,
            category: "Web Development",
            date: "January 5, 2023",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            author: {
              name: "James Peterson",
              avatar: "https://randomuser.me/api/portraits/men/45.jpg",
              role: "Frontend Architect"
            }
          }
        ];

        const foundBlog = mockBlogs.find(b => b.id === parseInt(id));
        
        if (foundBlog) {
          setBlog(foundBlog);
          
          // Simulate fetching related blogs (same category)
          const related = mockBlogs
            .filter(b => b.category === foundBlog.category && b.id !== foundBlog.id)
            .slice(0, 3);
          setRelatedBlogs(related);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

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
              <span className="blog-date">{blog.date}</span>
              <span className="blog-read-time">{blog.readTime}</span>
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
              <img src={blog.author.avatar} alt={blog.author.name} />
            </div>
            <div className="author-info">
              <h4>Written by {blog.author.name}</h4>
              <p>{blog.author.role}</p>
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
                  key={relatedBlog.id}
                  className="related-blog-card"
                  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
                >
                  <Link to={`/blog/${relatedBlog.id}`} className="related-blog-link">
                    <div className="related-blog-image">
                      <img src={relatedBlog.image} alt={relatedBlog.title} />
                    </div>
                    <div className="related-blog-content">
                      <h3>{relatedBlog.title}</h3>
                      <div className="related-blog-meta">
                        <span>{relatedBlog.date}</span>
                        <span>{relatedBlog.readTime}</span>
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
              <input type="email" placeholder="Your email address" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;