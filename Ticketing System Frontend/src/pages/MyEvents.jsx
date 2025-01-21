import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./MyEvents.css";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorEvents = async () => {
      const vendorId = localStorage.getItem("vendorId"); 
      if (!vendorId) {
        setError("Vendor ID not found. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/events/vendor/${vendorId}/events`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError("Failed to fetch events.");
        }
      } catch (error) {
        setError("An error occurred while fetching events.");
      }
    };

    fetchVendorEvents();
  }, []);

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-events-container">
      <Navbar />
      <div className="my-events-content">
        <h2 className="my-events-title">My Events</h2>
        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.name}</h3>
                <p><strong>Total Tickets:</strong> {event.totalTickets}</p>
                <p><strong>Tickets Sold:</strong> {event.ticketsSold}</p>
                <p><strong>Tickets Released:</strong> {event.ticketsReleased}</p>
                <p><strong>Max Capacity:</strong> {event.maxTicketCapacity}</p>
                <p><strong>Sale Active:</strong> {event.saleActive ? "Yes" : "No"}</p>
                <div className="event-actions">
                  <button
                    className="view-button"
                    onClick={() => navigate(`/dashboard/vendor/event-details/${event.id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No events created yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
