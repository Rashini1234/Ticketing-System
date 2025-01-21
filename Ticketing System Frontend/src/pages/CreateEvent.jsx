import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./CreateEvent.css";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    time: "",
    price: "",
    totalTickets: "",
    ticketReleaseRate: "",
    maxCapacity: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const dateTime = `${formData.date}T${formData.time}`;

    const vendorId = localStorage.getItem("vendorId");

    if (!vendorId) {
      setError("Vendor ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/events/create?vendorId=${vendorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.eventName,
          dateTime: dateTime,
          ticketPrice: formData.price,
          totalTickets: formData.totalTickets,
          ticketReleaseRate: formData.ticketReleaseRate,
          maxTicketCapacity: formData.maxCapacity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Event created successfully.");
        navigate(`/dashboard/vendor/event-details/${data.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create event.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="create-event-container">
      <Navbar />
      <div className="create-event-box">
        <h2 className="create-event-caption">Create Event</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Enter the event name"
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ticket Price (LKR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter ticket price"
              required
            />
          </div>
          <div className="form-group">
            <label>Total Tickets</label>
            <input
              type="number"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              placeholder="Enter total tickets"
              required
            />
          </div>
          <div className="form-group">
            <label>Ticket Release Rate</label>
            <input
              type="number"
              name="ticketReleaseRate"
              value={formData.ticketReleaseRate}
              onChange={handleChange}
              placeholder="Enter ticket release rate"
              required
            />
          </div>
          <div className="form-group">
            <label>Max Capacity</label>
            <input
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              placeholder="Enter max capacity of the pool"
              required
            />
          </div>
          <button type="submit" className="create-event-button">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
