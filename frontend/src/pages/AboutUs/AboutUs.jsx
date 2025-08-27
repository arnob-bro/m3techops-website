import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import './AboutUs.css';

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "With over 15 years of experience in the tech industry, Alex founded M3 TECHOPS to bridge the gap between innovative ideas and practical digital solutions.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "CTO",
      bio: "Sarah leads our technical team with expertise in cloud architecture and scalable systems. She's passionate about building robust solutions that stand the test of time.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Lead Developer",
      bio: "Michael specializes in frontend technologies and user experience design, ensuring our solutions are not just functional but delightful to use.",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 4,
      name: "Emily Wilson",
      role: "UX/UI Designer",
      bio: "Emily transforms complex requirements into intuitive interfaces that users love. Her design thinking approach drives our product development.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We constantly push boundaries to deliver cutting-edge solutions."
    },
    {
      title: "Integrity",
      description: "Honesty and transparency guide all our business practices."
    },
    {
      title: "Excellence",
      description: "We strive for perfection in everything we deliver."
    },
    {
      title: "Collaboration",
      description: "Great ideas come from teamwork and shared vision."
    }
  ];

  const reasons = [
    "15+ years of combined industry experience",
    "Proven track record with 100+ successful projects",
    "Custom solutions tailored to your specific needs",
    "Cutting-edge technology stack",
    "Transparent communication at every stage",
    "Ongoing support and maintenance"
  ];

  // Optimized faster animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            className="about-hero-content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 variants={itemVariants}>About M3 TECHOPS</motion.h1>
            <motion.p variants={itemVariants}>
              We're a team of passionate technologists dedicated to transforming businesses through innovative digital solutions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <motion.div
            className="mission-grid"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div className="mission-content" variants={fadeInUp}>
              <h2>Our Mission</h2>
              <p>
                To empower businesses of all sizes with technology solutions that drive growth, efficiency, and competitive advantage in an increasingly digital world.
              </p>
            </motion.div>

            <motion.div className="vision-content" variants={fadeInUp}>
              <h2>Our Vision</h2>
              <p>
                To be the most trusted partner for digital transformation, recognized for our technical excellence, innovative approach, and unwavering commitment to client success.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h2 variants={itemVariants} className="section-title">Our Core Values</motion.h2>
            <motion.p variants={itemVariants} className="section-subtitle">
              These principles guide everything we do
            </motion.p>

            <motion.div className="values-grid" variants={staggerContainer}>
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="value-card"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <div className="value-number">{index + 1}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h2 variants={itemVariants} className="section-title">Meet Our Team</motion.h2>
            <motion.p variants={itemVariants} className="section-subtitle">
              The talented individuals behind our success
            </motion.p>

            <motion.div className="team-grid" variants={staggerContainer}>
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="team-card"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <div className="team-image">
                    <img src={member.image} alt={member.name} />
                    <div className="team-social">
                      <a href={member.social.linkedin} aria-label={`Connect with ${member.name} on LinkedIn`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                      <a href={member.social.twitter} aria-label={`Follow ${member.name} on Twitter`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    <p className="team-bio">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="about-why">
        <div className="container">
          <motion.div
            className="why-grid"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div className="why-content" variants={fadeInUp}>
              <h2>Why Choose M3 TECHOPS?</h2>
              <p>
                We combine technical expertise with business acumen to deliver solutions that not only work flawlessly but also drive real business results.
              </p>
              
              <ul className="why-list">
                {reasons.map((reason, index) => (
                  <motion.li
                    key={index}
                    variants={fadeInUp}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <FiCheck className="check-icon" />
                    {reason}
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="why-cta"
                whileHover={{ x: 3 }}
              >
                <a href="/contact" className="btn btn-primary">
                  Get in Touch <FiArrowRight />
                </a>
              </motion.div>
            </motion.div>

            <motion.div className="why-image" variants={fadeInUp}>
              <div className="image-wrapper">
                <div className="image-overlay"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Our team working together" 
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;