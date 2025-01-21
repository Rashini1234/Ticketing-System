import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./EventDetails.css";

const EventDetails = () => {
  const { id: eventId } = useParams(); 
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
      if (response.ok) {
        const updatedEvent = await response.json();
        setEventDetails(updatedEvent); 
      } else {
        console.error("Failed to fetch event details.");
        setError("Failed to fetch event details.");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("An error occurred while fetching event details.");
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const handleAction = async (action) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/${action}/${eventId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        setMessage(`${action.replace("-", " ")} successful.`);
        fetchEventDetails(); 
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Failed to ${action.replace("-", " ")}`);
      }
    } catch (err) {
      console.error("Error performing action:", err);
      setError("An error occurred while performing the action.");
    } finally {
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
    }
  };

  const releaseTickets = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/release/${eventId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        setMessage("Tickets released successfully.");
        fetchEventDetails(); 
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to release tickets.");
      }
    } catch (err) {
      console.error("Error releasing tickets:", err);
      setError("An error occurred while releasing tickets.");
    } finally {
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
    }
  };

  if (!eventDetails) return <p>Loading event details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="event-details-container">
      <Navbar />
      <div className="event-details-box">
        <h2 className="event-details-caption">Event Details</h2>
        <div className="event-info">
          <p><strong>Event Name:</strong> {eventDetails.name}</p>
          <p><strong>Total Tickets:</strong> {eventDetails.totalTickets}</p>
          <p><strong>Tickets Sold:</strong> {eventDetails.ticketsSold}</p>
          <p><strong>Tickets Released:</strong> {eventDetails.ticketsReleased}</p>
          <p><strong>Max Ticket Capacity:</strong> {eventDetails.maxTicketCapacity}</p>
          <p><strong>Sale Active:</strong> {eventDetails.saleActive ? "Yes" : "No"}</p>
        </div>
        {message && <p className="success-message">{message}</p>}
        <div className="action-buttons">
          <button
            className="action-button"
            onClick={() => handleAction("start-sale")}
          >
            Start Sale
          </button>
          <button
            className="action-button"
            onClick={() => handleAction("release")}
          >
            Release Tickets
          </button>
          <button
            className="action-button"
            onClick={() => handleAction("stop-sale")}
          >
            Stop Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
