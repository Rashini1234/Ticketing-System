package com.example.ticketing_system.repository;

import com.example.ticketing_system.model.Ticket;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Fetch all sold tickets for a specific event (customerName is not null)
    List<Ticket> findByEventIdAndCustomerNameIsNotNull(Long eventId);

    @EntityGraph(attributePaths = {"event"})
    List<Ticket> findByCustomerEmail(String email);

    

}
