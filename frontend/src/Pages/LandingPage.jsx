import React, { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Element } from "react-scroll";
import './LandingPage.css';
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    // Function to check if an element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    }
    
    // Function to handle scroll animations
    function handleScrollAnimations() {
      const cards = document.querySelectorAll('.feature-card');
      
      cards.forEach(card => {
        if (isInViewport(card)) {
          card.classList.add('animated');
        }
      });
    }
    
    // Initial check and add scroll event listener
    handleScrollAnimations();
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScrollAnimations);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <Navbar />
      <section className="hero">
        <h1>AI-Powered Evaluation for Educators</h1>
        <p>Streamline your grading process with our intelligent evaluation system that ranks student submissions based on your custom criteria.</p>
        <Link to="/signup-page"><button className='learn-more'>Get Started</button></Link>
      </section>
      
      <Element name='feature-section'><section id="features" className="features">
        <h2>Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">📚</div>
            <h3>Resource Sharing</h3>
            <p>Easily share educational materials, presentations, and study guides in one centralized location.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📝</div>
            <h3>Assignment Management</h3>
            <p>Create, distribute, and grade assignments with our intuitive assignment workflow system.</p>
          </div>
          <div className="feature-card">
            <div className="icon">💬</div>
            <h3>Seamless Communication</h3>
            <p>Connect through direct messaging, discussion forums, and virtual classroom sessions.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor learning progress with detailed analytics and personalized dashboards.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🔔</div>
            <h3>Smart Notifications</h3>
            <p>Stay updated with important deadlines, announcements, and activity alerts.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🔒</div>
            <h3>Secure Environment</h3>
            <p>Enjoy peace of mind with our robust security measures and privacy controls.</p>
          </div>
        </div>
      </section></Element>
      
      <section id="signup" className="signup-section">
        <h2>Join Our Educational Community</h2>
        <p>Choose your role to get started with a personalized experience:</p>
        <div className="signup-buttons">
          <Link to="/signup-page" className="signup-btn student-btn">Sign Up as Student</Link>
          <Link to="/signup-page" className="signup-btn teacher-btn">Sign Up as Teacher</Link>
        </div>
        <Link to="./login-page"><p className='already-login'><u>Already have an account? Login</u></p></Link>
      </section>
      
      <footer className='landing-footer'>
        <p>&copy; 2025 VisionGrade. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;