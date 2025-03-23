import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import "./navbar.css";

const Navbar = () => {
    const [user, setUser] = useState(null);  // Store user info (null = not logged in)

    useEffect(() => {
        // Simulate getting user data from localStorage or API after login
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <div className="navbar">
            <div className="navbar-logo">
                <Link to="/">LOGO</Link>
            </div>
            
            <div className="navbar-menu">
                <Link to="/" className="navbar-item">Home</Link>
                <a href="#features" className="navbar-item">Features</a>
                <Link to="/contact" className="navbar-item">Contact</Link>
            </div>

            <div className="navbar-actions">
                {user ? (
                    <div className="profile-section">
                        <img src={user.profilePic} alt="User" className="profile-pic" />
                    </div>
                ) : (
                    <a href="#signup">
                         <button className="login-btn">Login/SignUp</button>
                    </a>
                )}
            </div>
        </div>
    );
};

export default Navbar;
