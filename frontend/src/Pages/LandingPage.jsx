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
            <div className="icon">🌍</div>
            <h3>Multilingual Support</h3>
            <p>Analyse submissions effortlessly in multiple languages with seamless translations.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🎥</div>
            <h3>Video Context Extraction</h3>
            <p>Go beyond audio and extract meaningful insights from videos.</p>
          </div>
          <div className="feature-card">
            <div className="icon"> ✍️</div>
            <h3>Handwritten Character Recognition</h3>
            <p>Convert handwritten text into digital form with precision.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📨</div>
            <h3>Updating Emails</h3>
            <p>Automate and enhance your email management for efficiency.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🤖</div>
            <h3>AI Chatbot</h3>
            <p>Get instant, intelligent responses with our AI-powered chatbot.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🎓</div>
            <h3>Personalized Feedback for Students</h3>
            <p> Receive tailored insights to improve learning outcomes.</p>
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