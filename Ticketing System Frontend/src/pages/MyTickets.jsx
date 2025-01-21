import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./MyTickets.css";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchasedTickets = async () => {
      const email = localStorage.getItem("email"); 

      if (!email) {
        setError("User is not logged in.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/events/my-tickets?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
          setError(null); 
        } else {
          const errorMessage = await response.text();
          setError(errorMessage || "Failed to fetch tickets.");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError("An error occurred while fetching tickets.");
      }
    };

    fetchPurchasedTickets();
  }, []);

  return (
    <div className="my-tickets-container">
      <Navbar />
      <div className="my-tickets-content">
        <h2 className="my-tickets-title">My Tickets</h2>
        {error && <p className="error-message">{error}</p>}
        {tickets.length > 0 ? (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <h3>{ticket.eventName}</h3>
                <p><strong>Event Name:</strong> {ticket.event}</p>
                <p><strong>Date:</strong> {new Date(ticket.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(ticket.date).toLocaleTimeString()}</p>
                <p><strong>Ticket ID:</strong> {ticket.id}</p>
                <p><strong>Purchase Date:</strong> {new Date(ticket.purchaseTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          !error && <div className="no-tickets">You have not purchased any tickets yet.</div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
