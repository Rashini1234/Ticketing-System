package com.example.ticketing_system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private double ticketPrice;

    @Column(nullable = false)
    private int totalTickets;
    @Column(nullable = false)
    private int ticketReleaseRate;

    @Column(nullable = false)
    private int maxTicketCapacity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private User vendor;

    @Column(nullable = false)
    private int ticketsSold = 0;

    @Column(nullable = false)
    private boolean saleActive = false;

    public boolean isSaleActive() {
        return saleActive;
    }

    public void setSaleActive(boolean saleActive) {
        this.saleActive = saleActive;
    }


    public int getTicketsSold() {
        return ticketsSold;
    }

    public void incrementTicketsSold() {
        this.ticketsSold++;
    }

    @Column(nullable = false)
    private int ticketsReleased = 0;

    public int getTicketsReleased() {
        return ticketsReleased;
    }

    public void incrementTicketsReleased(int count) {
        this.ticketsReleased += count;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public double getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public int getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(int totalTickets) {
        this.totalTickets = totalTickets;
    }

    public int getTicketReleaseRate() {
        return ticketReleaseRate;
    }

    public void setTicketReleaseRate(int ticketReleaseRate) {
        this.ticketReleaseRate = ticketReleaseRate;
    }

    public int getMaxTicketCapacity() {
        return maxTicketCapacity;
    }

    public void setMaxTicketCapacity(int maxTicketCapacity) {
        this.maxTicketCapacity = maxTicketCapacity;
    }

    public User getVendor() {
        return vendor;
    }

    public void setVendor(User vendor) {
        this.vendor = vendor;
    }

    public void setTicketsSold(int ticketsSold) {
        this.ticketsSold = ticketsSold;
    }

    public void setTicketsReleased(int ticketsReleased) {
        this.ticketsReleased = ticketsReleased;
    }

}
