import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import Navbar from "../components/Navbar";

const BACKEND_URL = "http://localhost:3000";

const SignUpPage = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({
    name: "", // Replacing confirmPassword with name
    username: "",
    email: "",
    password: "",
    role: "", // get role from active tab : ["user", "teacher"]
    access: "viewer", // Default value for access
    department: "",
    designation: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Simple validation function
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Username validation
    if (!formData.username) {
      formErrors.username = "Username is required.";
      isValid = false;
    }

    // Password validation (at least 6 characters)
    if (!formData.password || formData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    // Full Name validation
    if (!formData.name) {
      formErrors.name = "Full Name is required.";
      isValid = false;
    }

    // Teacher-specific validations
    if (activeTab === "teacher") {
      if (!formData.designation) {
        formErrors.designation = "Designation is required for teachers.";
        isValid = false;
      }
      if (!formData.department) {
        formErrors.department = "Department is required for teachers.";
        isValid = false;
      }
    }

    setErrors(formErrors); // Set validation errors
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    // Prepare data to send to the API
    const dataToSend = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: activeTab === "student" ? "user" : "teacher", // 'user' or 'teacher'
      access: formData.access,
      department: formData.department,
      designation: formData.designation,
    };

    console.log("Data to send:", dataToSend);

    // Send data to API endpoint
    fetch(`${BACKEND_URL}/account/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user !== null || data.user !== undefined) {
          // Redirect to dashboard or appropriate page
          if (data.user.role === "user" || data.user.role === "teacher") {
            navigate("/login-page");
          } else {
            setErrors("Invalid role. Please try again.");
          }
        } else {
          setErrors(data.message || "Login failed");
        }
      })
      .catch((error) => {
        console.log("inside signup-frontend");
        setErrors("Error:", error);
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
            className={`tab-item ${
              activeTab === "student" ? "active-tab" : ""
            }`}
            onClick={() => switchTab("student")}
          >
            Student
          </div>
          <div
            className={`tab-item ${
              activeTab === "teacher" ? "active-tab" : ""
            }`}
            onClick={() => switchTab("teacher")}
          >
            Teacher
          </div>
        </div>

        {activeTab === "student" && (
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
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="form-input-group">
              <label htmlFor="student-username">Username</label>
              <input
                type="text"
                id="student-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              {errors.username && <p className="error">{errors.username}</p>}
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
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="form-input-group">
              <label htmlFor="student-name">Full Name</label>
              <input
                type="text"
                id="student-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        )}

        {activeTab === "teacher" && (
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
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="form-input-group">
              <label htmlFor="teacher-username">Username</label>
              <input
                type="text"
                id="teacher-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              {errors.username && <p className="error">{errors.username}</p>}
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
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="form-input-group">
              <label htmlFor="teacher-name">Full Name</label>
              <input
                type="text"
                id="teacher-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              {errors.name && <p className="error">{errors.name}</p>}
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
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
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
              {errors.designation && (
                <p className="error">{errors.designation}</p>
              )}
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
              {errors.department && (
                <p className="error">{errors.department}</p>
              )}
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>
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
