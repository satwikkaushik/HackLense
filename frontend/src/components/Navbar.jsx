import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import "./navbar.css";

const Navbar = () => {
    const handleClick = () => {
        window.scrollTo(0, 0); 
      };

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
                <Link to="/">🏆 AssesRank</Link>
            </div>
            
            <div className="navbar-menu">
                <Link to="/" onClick={handleClick} className="navbar-item">Home</Link>
                <Link to="/#features" className="navbar-item">Features</Link>
                <Link to="/contact"  onClick={handleClick} className="navbar-item">Contact</Link>
                <Link to="/contact#find-us" className="navbar-item">Find Us</Link>
            </div>

            <div className="navbar-actions">
                {user ? (
                    <div className="profile-section">
                        <img src={user.profilePic} alt="User" className="profile-pic" />
                    </div>
                ) : (
                    <Link to="/#signup">
                         <button className="login-btn">Login / SignUp</button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;