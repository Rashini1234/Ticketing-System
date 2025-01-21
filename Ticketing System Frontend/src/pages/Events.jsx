import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [purchasing, setPurchasing] = useState(false); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events/customer-events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data); 
        } else {
          setError(`Failed to fetch events: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("An error occurred while fetching events.");
      } finally {
        setLoading(false); 
      }
    };

    fetchEvents();
  }, []);

  const handleBuyTicket = async (eventId) => {
    const customerDetails = {
      name: localStorage.getItem("name"), 
      email: localStorage.getItem("email"), 
    };

    if (!customerDetails.name || !customerDetails.email) {
      alert("Customer details are missing. Please log in to purchase tickets.");
      return;
    }

    try {
      setPurchasing(true); 

      const response = await fetch(`http://localhost:8080/api/events/buy/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerDetails),
      });

      if (response.ok) {
        alert("Ticket purchased successfully!");
      } else {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        alert(`Failed to purchase ticket: ${errorData}`);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("An error occurred while purchasing the ticket.");
    } finally {
      setPurchasing(false); 
    }
  };

  return (
    <div className="events-container">
      <Navbar />
      <div className="events-content">
        <h2 className="events-title">Available Events</h2>

        {loading && <p>Loading events...</p>}
        {error && <p className="error-message">{error}</p>}

        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.name}</h3>
                <p><strong>Date:</strong> {new Date(event.dateTime).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(event.dateTime).toLocaleTimeString()}</p>
                <p><strong>Price:</strong>{event.ticketPrice} LKR</p>
                <button
                  className="buy-ticket-button"
                  onClick={() => handleBuyTicket(event.id)}
                  disabled={purchasing} 
                >
                  {purchasing ? "Processing..." : "Buy Ticket"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          !loading && <div className="no-events">No events available at the moment.</div>
        )}
      </div>
    </div>
  );
};

export default Events;