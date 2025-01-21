package com.example.ticketing_system.repository;

import com.example.ticketing_system.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find all events by a specific vendor
    List<Event> findByVendorId(Long vendorId);

}
