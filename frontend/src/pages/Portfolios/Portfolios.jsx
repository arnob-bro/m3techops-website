import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Portfolios.css';
import ServiceApi from '../../apis/serviceApi';
import PortfolioApi from '../../apis/portfolioApi';
const serviceApi = new ServiceApi();
const portfolioApi = new PortfolioApi();

// Sample project data
const projects = [
  {
    portfolio_item_id: 1,
    title: "E-commerce Platform",
    category: "Web Development",
    description: "A high-performance online store with custom checkout flow",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    problem: "Client needed a scalable e-commerce solution to replace their outdated platform that couldn't handle increased traffic.",
    solution: "Built a custom React frontend with Node.js backend and MongoDB database, integrating Stripe for secure payments.",
    tech_stack: ["React", "Node.js", "Express", "MongoDB", "Stripe API", "Redux"],
    results: "Increased conversion rate by 35%, reduced page load time by 60%, and handled 2x more traffic during peak seasons."
  },
  {
    portfolio_item_id: 2,
    title: "Health & Fitness App",
    category: "Mobile Development",
    description: "Personalized workout and nutrition tracking application",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["React Native", "Firebase", "Google Fit API"],
    problem: "Fitness startup needed a cross-platform app to help users track workouts and nutrition with personalized recommendations.",
    solution: "Developed a React Native app with Firebase backend, integrating with health APIs for comprehensive tracking.",
    tech_stack: ["React Native", "Firebase", "Google Fit API", "Apple HealthKit", "Redux"],
    results: "100,000+ downloads in first 3 months, 4.8/5 app store rating, and 75% user retention after 30 days."
  },
  {
    portfolio_item_id: 3,
    title: "Enterprise Dashboard",
    category: "Cloud Solutions",
    description: "Real-time analytics dashboard for business intelligence",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["AWS", "React", "D3.js", "Python"],
    problem: "Large corporation needed a unified dashboard to visualize data from multiple sources in real-time.",
    solution: "Created a cloud-based solution with AWS services and React frontend with advanced data visualization.",
    tech_stack: ["AWS Lambda", "React", "D3.js", "Python", "Amazon QuickSight", "GraphQL"],
    results: "Reduced decision-making time by 40%, consolidated 5 separate tools into one platform, saving $250k/year."
  },
  {
    portfolio_item_id: 4,
    title: "AI Chatbot",
    category: "AI Solutions",
    description: "Conversational AI assistant for customer support",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Python", "TensorFlow", "NLP", "AWS"],
    problem: "Customer support team overwhelmed with repetitive inquiries, leading to long response times.",
    solution: "Developed an AI chatbot using NLP to handle common queries, routing only complex issues to humans.",
    tech_stack: ["Python", "TensorFlow", "NLTK", "AWS Lex", "Django"],
    results: "Reduced support tickets by 65%, improved response time from 4 hours to 2 minutes, and achieved 92% resolution rate."
  },
  {
    portfolio_item_id: 5,
    title: "Supply Chain Management",
    category: "Custom Software",
    description: "End-to-end supply chain optimization platform",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Java", "Spring Boot", "React", "PostgreSQL"],
    problem: "Manufacturer needed to streamline their global supply chain with real-time tracking and predictive analytics.",
    solution: "Built a custom platform integrating IoT sensors with predictive algorithms for inventory optimization.",
    tech_stack: ["Java", "Spring Boot", "React", "PostgreSQL", "Apache Kafka", "TensorFlow"],
    results: "Reduced inventory costs by 28%, improved delivery times by 35%, and eliminated stockouts completely."
  },
  {
    portfolio_item_id: 6,
    title: "FinTech Mobile Banking",
    category: "Mobile Development",
    description: "Secure mobile banking application with biometric auth",
    image: "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Flutter", "Firebase", "Blockchain", "Biometrics"],
    problem: "Bank needed a modern mobile app to compete with fintech startups while maintaining high security standards.",
    solution: "Developed a cross-platform Flutter app with biometric authentication and blockchain-based transaction security.",
    tech_stack: ["Flutter", "Firebase", "Hyperledger", "Biometric API", "Node.js"],
    results: "200% increase in mobile transactions, 4.9/5 app store rating, and zero security breaches in 2 years."
  },
  // ... other projects remain the same
];



const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isLoading, setIsLoading] = useState(true);


  const fetchPortfolioItems = async () => {
    try {

      const result = await portfolioApi.getPortfolios();
      setPortfolioItems(result.portfolios);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === filter));
    }
  }, [filter]);

  const categories = ['All', ...new Set(projects.map(project => project.category))];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } }
  };


  
  return (
    <div className="projects-page-project">
      <motion.div 
        className="projects-hero-project"
        initial="hidden"
        animate="show"
        variants={fadeIn}
      >
        <div className="container-project">
          <h1>Our Portfolio</h1>
          <p>Explore our successful projects and see how we've helped businesses transform their digital presence.</p>
        </div>
      </motion.div>

      <div className="projects-container-project">
        <div className="container-project">
          <motion.div 
            className="projects-filter-project"
            initial="hidden"
            animate="show"
            variants={fadeIn}
          >
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn-project ${filter === category ? 'active-project' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="projects-loading-project">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="project-skeleton-project"></div>
              ))}
            </div>
          ) : (
            <motion.div
              className="projects-grid-project"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.portfolio_item_id}
                  className="project-card-project"
                  variants={item}
                  whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)' }}
                >
                  <div className="project-image-project">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-content-project">
                    <span className="project-category-project">{project.category}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags-project">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="tag-project">{tag}</span>
                      ))}
                    </div>
                   <Link 
                      to={`/projects/${project.portfolio_item_id}`} 
                      className="project-link-project"
                      state={{ project }}
                      onClick={() => {
                        // Small delay to ensure navigation happens first
                        setTimeout(() => {
                          window.scrollTo(0, 0);
                        }, 100);
                      }}
                    >
                      View Case Study <span>→</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
              {/* {totalPages > 1 && (
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
              
                
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  Next <FiChevronRight />
                </button>
              </div>
          
          
          )} */}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;