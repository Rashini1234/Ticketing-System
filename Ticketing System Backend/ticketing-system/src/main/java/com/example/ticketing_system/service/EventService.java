package com.example.ticketing_system.service;

import com.example.ticketing_system.model.Event;
import com.example.ticketing_system.model.Ticket;
import com.example.ticketing_system.model.User;
import com.example.ticketing_system.repository.EventRepository;
import com.example.ticketing_system.repository.TicketRepository;
import com.example.ticketing_system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketPool ticketPool;

    public EventService(EventRepository eventRepository, TicketRepository ticketRepository, UserRepository userRepository, TicketPool ticketPool) {
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.ticketPool = ticketPool;
    }

    // Create a new event
    public Map<String, Object> createEvent(Event event, Long vendorId) {
        User vendor = userRepository.findById(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        event.setVendor(vendor);
        event.setTicketsSold(0);
        event.setTicketsReleased(0);
        Event savedEvent = eventRepository.save(event);
        return convertEventToMap(savedEvent);
    }

    // Get an event by ID
    public Map<String, Object> getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        return convertEventToMap(event);
    }

    // Release tickets
    public void releaseTickets(Long eventId) throws InterruptedException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (!event.isSaleActive()) {
            throw new IllegalStateException("Ticket sales are not active for this event.");
        }

        // Initialize the ticket pool with event parameters
        ticketPool.initialize(event.getMaxTicketCapacity(), event.getTotalTickets());

        int ticketsReleased = 0;
        int totalTickets = event.getTotalTickets();
        int releaseRate = event.getTicketReleaseRate();

        // Loop to release tickets
        while (ticketsReleased < totalTickets) {
            try {
                Ticket ticket = new Ticket();
                ticket.setEvent(event);
                ticket.setTicketCode("TICKET-" + event.getId() + "-" + System.currentTimeMillis() + "-" + ticketsReleased);

                // Add ticket to the pool
                ticketPool.addTicket(ticket);

                ticketsReleased++;

                // Simulate release rate
                Thread.sleep(releaseRate);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Ticket release was interrupted", e);
            }
        }

        // Update event with the total tickets released
        event.setTicketsReleased(event.getTicketsReleased() + ticketsReleased); // Increment tickets released
        eventRepository.save(event); // Save the event to update the database

        System.out.println("Total Tickets Released: " + ticketsReleased);
        System.out.println("Updated Tickets Released in DB: " + event.getTicketsReleased());
    }

    // Purchase tickets
    public void purchaseTicket(Long eventId, User customer) throws InterruptedException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (!event.isSaleActive()) {
            throw new IllegalStateException("Ticket sales are not active for this event.");
        }

        // Check if tickets are available in the pool
        if (ticketPool.getAvailableTickets() <= 0) {
            throw new IllegalStateException("No tickets available in the pool for this event. Please wait for more tickets to be released.");
        }

        // Check if the customer already exists in the database
        User existingCustomer = userRepository.findByEmail(customer.getEmail())
                .orElseGet(() -> userRepository.save(customer)); // Save if not exists

        // Retrieve a ticket from the pool
        Ticket ticket = ticketPool.retrieveTicket();
        ticket.setCustomerName(customer.getName());
        ticket.setCustomerEmail(customer.getEmail());
        ticket.setPurchaseTime(LocalDateTime.now()); // Set the purchase time
        ticketRepository.save(ticket); // Save the ticket with customer details

        // Update the event's tickets sold count
        event.setTicketsSold(event.getTicketsSold() + 1);
        eventRepository.save(event);
    }


    // Start sale
    public void startSale(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        event.setSaleActive(true);
        eventRepository.save(event);
    }

    // Stop sale
    public void stopSale(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        event.setSaleActive(false);
        eventRepository.save(event);
    }

    // Helper method to convert Event to Map
    private Map<String, Object> convertEventToMap(Event event) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", event.getId());
        map.put("name", event.getName());
        map.put("ticketsSold", event.getTicketsSold());
        map.put("ticketsReleased", event.getTicketsReleased());
        map.put("totalTickets", event.getTotalTickets());
        map.put("maxTicketCapacity", event.getMaxTicketCapacity());
        map.put("saleActive", event.isSaleActive());
        return map;
    }

    // Fetch al events of a specific vendor
    public List<Map<String, Object>> getEventsByVendor(Long vendorId) {
        List<Event> events = eventRepository.findByVendorId(vendorId);
        return events.stream().map(this::convertEventToMap).toList();
    }

    // Fetch all events with minimal details for customers
    public List<Map<String, Object>> getAllCustomerEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream().map(this::convertEventToCustomerMap).toList();
    }

    // Convert Event to minimal Map
    private Map<String, Object> convertEventToCustomerMap(Event event) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", event.getId());
        map.put("name", event.getName());
        map.put("dateTime", event.getDateTime().toString()); // Ensure the format is correct
        map.put("ticketPrice", event.getTicketPrice());
        return map;
    }

    // Fetch a list of all tickets sold for a specific event
    public List<Map<String, Object>> getTicketsSoldForEvent(Long eventId) {
        // Verify the event exists
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        // Fetch tickets for the event
        List<Ticket> tickets = ticketRepository.findByEventIdAndCustomerNameIsNotNull(eventId);

        // Map ticket and customer details to a response structure
        return tickets.stream().map(ticket -> {
            Map<String, Object> ticketDetails = new HashMap<>();
            ticketDetails.put("ticketId", ticket.getId());
            ticketDetails.put("ticketCode", ticket.getTicketCode());
            ticketDetails.put("purchaseTime", ticket.getPurchaseTime());
            ticketDetails.put("customerName", ticket.getCustomerName());
            ticketDetails.put("customerEmail", ticket.getCustomerEmail());
            return ticketDetails;
        }).toList();
    }

    public List<Map<String, Object>> getTicketsByCustomerEmail(String email) {
        // Fetch tickets from the repository
        List<Ticket> tickets = ticketRepository.findByCustomerEmail(email);

        // Map ticket details to a response structure
        return tickets.stream().map(ticket -> {
            Map<String, Object> ticketDetails = new HashMap<>();
            ticketDetails.put("id", ticket.getId());
            ticketDetails.put("event", ticket.getEvent().getName());
            ticketDetails.put("date", ticket.getEvent().getDateTime());
            ticketDetails.put("purchaseTime", ticket.getPurchaseTime());
            return ticketDetails;
        }).toList();
    }

    public List<Map<String, Object>> getTicketsSoldForVendor(Long vendorId) {
        // Fetch events created by the vendor
        List<Event> events = eventRepository.findByVendorId(vendorId);

        // Fetch tickets for each event and map them to a response structure
        return events.stream().flatMap(event -> {
            List<Ticket> tickets = ticketRepository.findByEventIdAndCustomerNameIsNotNull(event.getId());
            return tickets.stream().map(ticket -> {
                Map<String, Object> ticketDetails = new HashMap<>();
                ticketDetails.put("ticketId", ticket.getId());
                ticketDetails.put("ticketCode", ticket.getTicketCode());
                ticketDetails.put("eventName", event.getName());
                ticketDetails.put("eventDate", event.getDateTime());
                ticketDetails.put("customerName", ticket.getCustomerName());
                ticketDetails.put("customerEmail", ticket.getCustomerEmail());
                ticketDetails.put("purchaseTime", ticket.getPurchaseTime());
                return ticketDetails;
            });
        }).toList();
    }
}
