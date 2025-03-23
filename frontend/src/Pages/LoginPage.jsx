import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Switch between tabs (student/teacher)
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Form validation before submission
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setErrorMessage('Email and password are required.');
      return false;
    }

    // Basic email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  // Handle form submission (login)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      email: formData.email,
      password: formData.password,
      remember: formData.remember,
      role: activeTab === 'student' ? 'student' : 'teacher' // Determine role based on active tab
    };

    // Send data to API
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Redirect to dashboard or appropriate page
          window.location.href = '/teacher-dashboard'; // Example redirect
        } else {
          setErrorMessage(data.message || 'Login failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error); // Log the error to the console
        setErrorMessage('An error occurred. Please try again.'); // Display a generic error message
      });      
  };

  return (
    <div className="login-page-container">
      <div className="login-card-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
        </div>

        <div className="tab-selection">
          <div
            className={`tab-item ${activeTab === 'student' ? 'active-tab' : ''}`}
            onClick={() => switchTab('student')}
          >
            Student
          </div>
          <div
            className={`tab-item ${activeTab === 'teacher' ? 'active-tab' : ''}`}
            onClick={() => switchTab('teacher')}
          >
            Teacher
          </div>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {activeTab === 'student' && (
          <form className="login-form-student" onSubmit={handleSubmit}>
            <div className="form-input-group">
              <label htmlFor="student-email">Email or Student ID</label>
              <input
                type="text"
                id="student-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-input-group">
              <label htmlFor="student-password">Password</label>
              <input
                type="password"
                id="student-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="forgot-password-link">
              <a href="#">Forgot password?</a>
            </div>

            <div className="remember-me-checkbox">
              <input
                type="checkbox"
                id="student-remember"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
              />
              <label htmlFor="student-remember">Remember me</label>
            </div>

            <button type="submit" className="login-button">Log In</button>
          </form>
        )}

        {activeTab === 'teacher' && (
          <form className="login-form-teacher" onSubmit={handleSubmit}>
            <div className="form-input-group">
              <label htmlFor="teacher-email">Email Address</label>
              <input
                type="email"
                id="teacher-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-input-group">
              <label htmlFor="teacher-password">Password</label>
              <input
                type="password"
                id="teacher-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="forgot-password-link">
              <a href="#">Forgot password?</a>
            </div>

            <div className="remember-me-checkbox">
              <input
                type="checkbox"
                id="teacher-remember"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
              />
              <label htmlFor="teacher-remember">Remember me</label>
            </div>

            <button type="submit" className="login-button">Log In</button>
          </form>
        )}

        <div className="login-footer">
          Don't have an account? <Link to="/signup-page">Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
