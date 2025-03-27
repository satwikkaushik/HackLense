import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // We'll use js-cookie for easy cookie management
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user information from JWT cookie
    console.log("in useeffect");

    const token = Cookies.get("authToken");
    if (token) {
      console.log("token valid");
      // Decode the JWT to get user information
      console.log("token" + token);
      try {
        // Note: This is a simplified example. In a real app, you'd use a proper JWT decoding library
        const decodedUser = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: decodedUser.name || "User",
          email: decodedUser.email,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        // Clear invalid token
        Cookies.remove("jwt_token");
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear JWT cookie
    Cookies.remove("authToken");

    // Clear any other authentication-related cookies or local storage
    localStorage.removeItem("loggedInUser");

    // Reset user state
    setUser(null);

    fetch(`${BACKEND_URL}/account/logout`, {
      method: "POST",
      credentials: "include", // Include cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        console.log("Successfully logged out");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });

    // Redirect to landing page
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🏆 VisionGrade</Link>
      </div>

      <div className="nav-actions">
        <div className="user-profile">
          <div className="avatar">
            <span>{user ? user.name.charAt(0).toUpperCase() : "U"}</span>
          </div>
          <span className="username">{user ? user.name : "Guest"}</span>
        </div>

        <div className="navbar-actions">
          {user ? (
            <Link to="/">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </Link>
          ) : (
            <Link to="/">
              <button className="login-btn">Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
