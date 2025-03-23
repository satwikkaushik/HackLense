import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUpPage.css'; 
import Navbar from '../components/Navbar';

const SignUpPage = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // Replacing confirmPassword with name
    access: 'Viewer', // Default value for access
    designation: '',
    department: ''
  });

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation (can be expanded)
    // Removed password confirmation validation since we're using name

    // Prepare data to send to the API
    const dataToSend = {
      email: formData.email,
      password: formData.password,
      name: formData.name,  // Include name instead of confirmPassword
      access: formData.access,
      designation: formData.designation,
      department: formData.department,
      role: activeTab // 'student' or 'teacher'
    };

    // Send data to API endpoint
    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        // Handle success (e.g., redirect to login or dashboard)
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show error message)
      });
  };

  return (
    <div className="signup-page-container">
      <div className="signup-card-container">
        <div className="signup-header">
          <h1>Join Us</h1>
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

        {activeTab === 'student' && (
          <form className="signup-form-student" onSubmit={handleSubmit}>
            <div className="form-input-group">
              <label htmlFor="student-email">Email Address</label>
              <input 
                type="email" 
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

            <div className="form-input-group">
              <label htmlFor="student-name">Full Name</label>
              <input 
                type="text" 
                id="student-name" 
                name="name"  // Changed this field to name
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <button type="submit" className="signup-button">Sign Up</button>
          </form>
        )}

        {activeTab === 'teacher' && (
          <form className="signup-form-teacher" onSubmit={handleSubmit}>
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

            <div className="form-input-group">
              <label htmlFor="teacher-name">Full Name</label>
              <input 
                type="text" 
                id="teacher-name" 
                name="name"  // Changed this field to name
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-input-group">
              <label htmlFor="teacher-access">Access</label>
              <select 
                id="teacher-access" 
                name="access" 
                value={formData.access} 
                onChange={handleInputChange} 
                required
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div className="form-input-group">
              <label htmlFor="teacher-designation">Designation</label>
              <input 
                type="text" 
                id="teacher-designation" 
                name="designation" 
                value={formData.designation} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-input-group">
              <label htmlFor="teacher-department">Department</label>
              <input 
                type="text" 
                id="teacher-department" 
                name="department" 
                value={formData.department} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <button type="submit" className="signup-button">Sign Up</button>
          </form>
        )}

        <div className="signup-footer">
          Already have an account? <Link to="/login-page">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
