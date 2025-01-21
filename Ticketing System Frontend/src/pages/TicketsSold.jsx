import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./TicketsSold.css";

const TicketsSold = () => {
  const [tickets, setTickets] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchTicketsSold = async () => {
      const vendorId = localStorage.getItem("vendorId"); 

      if (!vendorId) {
        setError("Vendor is not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/events/vendor/${vendorId}/tickets-sold`
        );

        if (response.ok) {
          const data = await response.json();
          setTickets(data);
          setError(null); 
        } else {
          const errorMessage = await response.text();
          setError(errorMessage || "Failed to fetch tickets.");
        }
      } catch (error) {
        console.error("Error fetching tickets sold:", error);
        setError("An error occurred while fetching tickets.");
      } finally {
        setLoading(false); 
      }
    };

    fetchTicketsSold();
  }, []);

  return (
    <div className="tickets-sold-container">
      <Navbar />
      <div className="tickets-sold-content">
        <h2 className="tickets-sold-title">Tickets Sold</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : tickets.length > 0 ? (
          <div className="tickets-grid">
            {tickets.map((ticket, index) => (
              <div key={index} className="ticket-card">
                <h3>{ticket.eventId}</h3>
                <p>
                  <strong>Customer Name:</strong> {ticket.customerName}
                </p>
                <p>
                  <strong>Customer Email:</strong> {ticket.customerEmail}
                </p>
                <p>
                  <strong>Purchase Time:</strong>{" "}
                  {new Date(ticket.purchaseTime).toLocaleString()}
                </p>
                <p>
                  <strong>Event Date:</strong>{" "}
                  {new Date(ticket.eventDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tickets">No tickets sold yet.</div>
        )}
      </div>
    </div>
  );
};

export default TicketsSold;
