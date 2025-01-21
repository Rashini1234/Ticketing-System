package com.example.ticketing_system.controller;

import com.example.ticketing_system.model.Event;
import com.example.ticketing_system.model.User;
import com.example.ticketing_system.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Create a new event
    @PostMapping("/create")
    public Map<String, Object> createEvent(@RequestBody Event event, @RequestParam Long vendorId) {
        try {
            return eventService.createEvent(event, vendorId);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create event: " + e.getMessage());
            return errorResponse;
        }
    }

    // Get an event by ID
    @GetMapping("/{id}")
    public Map<String, Object> getEventById(@PathVariable Long id) {
        try {
            return eventService.getEventById(id);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }

    // Release Tickets for a specific event
    @PostMapping("/release/{eventId}")
    public String releaseTickets(@PathVariable Long eventId) {
        try {
            eventService.releaseTickets(eventId); // No count parameter
            return "Tickets released successfully.";
        } catch (IllegalStateException e) {
            return "Failed to release tickets: " + e.getMessage();
        } catch (Exception e) {
            return "An error occurred: " + e.getMessage();
        }
    }


    // Purchase a ticket for a specific event
    @PostMapping("/buy/{eventId}")
    public String purchaseTicket(@PathVariable Long eventId, @RequestBody User customer) {
        try {
            eventService.purchaseTicket(eventId, customer);
            return "Ticket purchased successfully.";
        } catch (Exception e) {
            return "Failed to purchase ticket: " + e.getMessage();
        }
    }

    // Start sale for a specific event
    @PostMapping("/start-sale/{eventId}")
    public String startSale(@PathVariable Long eventId) {
        try {
            eventService.startSale(eventId);
            return "Sale started.";
        } catch (IllegalArgumentException e) {
            return "Failed to start sale: " + e.getMessage();
        }
    }

    // Stop sale for a specific event
    @PostMapping("/stop-sale/{eventId}")
    public String stopSale(@PathVariable Long eventId) {
        try {
            eventService.stopSale(eventId);
            return "Sale stopped.";
        } catch (IllegalArgumentException e) {
            return "Failed to stop sale: " + e.getMessage();
        }
    }

    // Fetch all events created by a specific vendor
    @GetMapping("/vendor/{vendorId}/events")
    public List<Map<String, Object>> getEventsByVendor(@PathVariable Long vendorId) {
        return eventService.getEventsByVendor(vendorId);
    }

    // Fetch all events for customer dashboard
    @GetMapping("/customer-events")
    public List<Map<String, Object>> getAllEventsForCustomer() {
        return eventService.getAllCustomerEvents(); // Use a dedicated service method
    }

    // Fetch tickets purchased by the logged-in customer
    @GetMapping("/my-tickets")
    public ResponseEntity<List<Map<String, Object>>> getCustomerTickets(@RequestParam String email) {
        try {
            List<Map<String, Object>> tickets = eventService.getTicketsByCustomerEmail(email);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(Map.of("error", "Failed to fetch tickets: " + e.getMessage())));
        }
    }

    // Fetch a list of all tickets sold for a specific event
    @GetMapping("/{eventId}/tickets-sold")
    public List<Map<String, Object>> getTicketsSold(@PathVariable Long eventId) {
        return eventService.getTicketsSoldForEvent(eventId);
    }

    // Fetch sold tickets of a vendor
    @GetMapping("/vendor/{vendorId}/tickets-sold")
    public ResponseEntity<List<Map<String, Object>>> getTicketsSoldByVendor(@PathVariable Long vendorId) {
        try {
            List<Map<String, Object>> tickets = eventService.getTicketsSoldForVendor(vendorId);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(Map.of("error", "Failed to fetch tickets: " + e.getMessage())));
        }
    }

}
