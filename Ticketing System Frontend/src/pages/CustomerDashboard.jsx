import React from "react";
import Navbar from "../components/Navbar";
import "./CustomerDashboard.css";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="customer-dashboard-container">
      <Navbar />
      <h2 className="customer-dashboard-title">Customer Dashboard</h2>
      <div className="customer-dashboard-cards">
        <div className="card" onClick={() => navigate("/dashboard/customer/events")}>
          <h3>Events</h3>
          <p>Browse and purchase tickets for available events.</p>
        </div>
        <div className="card" onClick={() => navigate("/dashboard/customer/my-tickets")}>
          <h3>My Tickets</h3>
          <p>View tickets you have purchased.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
