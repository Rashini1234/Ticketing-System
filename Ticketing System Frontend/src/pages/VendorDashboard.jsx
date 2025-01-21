import React from "react";
import Navbar from "../components/Navbar";
import "./VendorDashboard.css";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="vendor-dashboard-container">
      <Navbar />
      <h2 className="vendor-dashboard-title">Vendor Dashboard</h2>
      <div className="vendor-dashboard-cards">
        <div className="card" onClick={() => navigate("/dashboard/vendor/create-event")}>
          <h3>Create Event</h3>
          <p>Add a new event for customers.</p>
        </div>
        <div className="card" onClick={() => navigate("/dashboard/vendor/my-events")}>
          <h3>My Events</h3>
          <p>Manage and update your events.</p>
        </div>
        <div className="card" onClick={() => navigate("/dashboard/vendor/tickets-sold")}>
          <h3>Tickets Sold</h3>
          <p>View details of tickets sold for your events.</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
