package com.example.ticketing_system.service;

import com.example.ticketing_system.model.Ticket;
import org.springframework.stereotype.Component;

import java.util.LinkedList;

@Component
public class TicketPool {
    private final LinkedList<Ticket> tickets = new LinkedList<>();
    private int maxCapacity;
    private int totalTicketsSold = 0;
    private int totalTickets;

    // Initialize the pool
    public synchronized void initialize(int maxCapacity, int totalTickets) {
        this.maxCapacity = maxCapacity;
        this.totalTickets = totalTickets;
        this.totalTicketsSold = 0;
        this.tickets.clear();
    }

    // Add a ticket safely
    public synchronized void addTicket(Ticket ticket) throws InterruptedException {
        while (tickets.size() >= maxCapacity) {
            System.out.println("Ticket pool is full. Waiting...");
            wait(); // Wait until space is available
        }
        tickets.add(ticket);
        System.out.println("Ticket added to pool: " + ticket.getTicketCode() + ". Current Pool Size: " + tickets.size());
        notifyAll(); // Notify consumers waiting for tickets
    }

    // Retrieve a ticket safely
    public synchronized Ticket retrieveTicket() throws InterruptedException {
        while (tickets.isEmpty()) {
            if (totalTicketsSold >= totalTickets) {
                throw new IllegalStateException("No tickets available.");
            }
            System.out.println("No tickets in pool. Waiting to retrieve...");
            wait(); // Wait if no tickets are available
        }
        Ticket ticket = tickets.removeFirst();
        totalTicketsSold++;
        System.out.println("Ticket retrieved: " + ticket.getTicketCode() + " | Tickets remaining in pool: " + tickets.size());
        notifyAll(); // Notify producers waiting to add tickets
        return ticket;
    }

    // Get the number of available tickets
    public synchronized int getAvailableTickets() {
        return tickets.size();
    }

    // Check if all tickets are sold
    public synchronized boolean allTicketsSold() {
        return totalTicketsSold >= totalTickets;
    }
}

