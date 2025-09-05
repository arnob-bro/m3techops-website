import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight, FiUsers, FiTarget, FiAward, FiGlobe } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import CountUp from 'react-countup';
import './AboutUs.css';

const AboutUs = () => {
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

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
      description: "We constantly push boundaries to deliver cutting-edge solutions.",
      icon: <FiGlobe />
    },
    {
      title: "Integrity",
      description: "Honesty and transparency guide all our business practices.",
      icon: <FiTarget />
    },
    {
      title: "Excellence",
      description: "We strive for perfection in everything we deliver.",
      icon: <FiAward />
    },
    {
      title: "Collaboration",
      description: "Great ideas come from teamwork and shared vision.",
      icon: <FiUsers />
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

  return (
    <div className="AboutUs-AU">
      {/* Floating Background Elements */}
      <div className="bg-decoration-AU">
        <div className="floating-element-AU element-1-AU"></div>
        <div className="floating-element-AU element-2-AU"></div>
        <div className="floating-element-AU element-3-AU"></div>
        <div className="floating-element-AU element-4-AU"></div>
      </div>

      {/* Hero Section */}
      <section className="about-hero-AU">
        <div className="container-AU">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-content-AU"
          >
            <div className="hero-badge-AU">
              <span>Our Story</span>
            </div>
            <h1>About M3 TECHOPS</h1>
            <p>We're a team of passionate technologists dedicated to transforming businesses through innovative digital solutions.</p>
            
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission-AU">
        <div className="container-AU">
          <div className="mission-grid-AU">
            <motion.div 
              className="mission-card-AU"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="card-icon-AU">
                <FiTarget />
              </div>
              <h2>Our Mission</h2>
              <p>To empower businesses of all sizes with technology solutions that drive growth, efficiency, and competitive advantage in an increasingly digital world.</p>
            </motion.div>

            <motion.div 
              className="mission-card-AU"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="card-icon-AU">
                <FiGlobe />
              </div>
              <h2>Our Vision</h2>
              <p>To be the most trusted partner for digital transformation, recognized for our technical excellence, innovative approach, and unwavering commitment to client success.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values-AU">
        <div className="container-AU">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="section-header-AU"
          >
            <h2>Our Core Values</h2>
            <p>These principles guide everything we do</p>
          </motion.div>

          <div className="values-grid-AU">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card-AU"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <div className="value-icon-AU">
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team-AU">
        <div className="container-AU">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="section-header-AU"
          >
            <h2>Meet Our Team</h2>
            <p>The talented individuals behind our success</p>
          </motion.div>

          <div className="team-grid-AU">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                className="team-card-AU"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <div className="team-image-AU">
                  <img src={member.image} alt={member.name} />
                  <div className="team-social-AU">
                    <a href={member.social.linkedin} aria-label={`Connect with ${member.name} on LinkedIn`} className="social-link-AU linkedin-AU">
                      <FaLinkedin />
                    </a>
                    <a href={member.social.twitter} aria-label={`Follow ${member.name} on Twitter`} className="social-link-AU twitter-AU">
                      <FaTwitter />
                    </a>
                  </div>
                </div>
                <div className="team-info-AU">
                  <h3>{member.name}</h3>
                  <p className="team-role-AU">{member.role}</p>
                  <p className="team-bio-AU">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="about-why-AU">
        <div className="container-AU">
          <div className="why-grid-AU">
            <motion.div 
              className="why-content-AU"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="section-header-AU">
                <h2>Why Choose M3 TECHOPS?</h2>
                <p>We combine technical expertise with business acumen to deliver solutions that not only work flawlessly but also drive real business results.</p>
              </div>
              
              <ul className="why-list-AU">
                {reasons.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <FiCheck className="check-icon-AU" />
                    {reason}
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="why-cta-AU"
                whileHover={{ x: 3 }}
              >
                <a href="/contact" className="btn-AU btn-primary-AU">
                  Get in Touch <FiArrowRight />
                </a>
              </motion.div>
            </motion.div>

            <motion.div 
              className="why-image-AU"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="image-wrapper-AU">
                <div className="image-overlay-AU"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Our team working together" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;