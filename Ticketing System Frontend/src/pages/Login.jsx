import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/api"; 
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await fetch(`http://localhost:8080/api/users/login`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.token); 
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);



        if (data.role === "VENDOR") {
          localStorage.setItem("vendorId", data.id); 
          navigate("/dashboard/vendor"); 
        } else if (data.role === "CUSTOMER") {
          navigate("/dashboard/customer"); 
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection and try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-caption">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {error && <p className="error-message">{error}</p>} {/* Display error messages */}
        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
