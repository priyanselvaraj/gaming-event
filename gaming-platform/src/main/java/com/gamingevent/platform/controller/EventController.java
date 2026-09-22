package com.gamingevent.platform.controller;

import com.gamingevent.platform.model.Event;
import com.gamingevent.platform.repository.EventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        if (event.getName() == null || event.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Event name is required"));
        }
        if (event.getGame() == null || event.getGame().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Game title is required"));
        }
        if (event.getDate() == null || event.getDate().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Event date is required"));
        }
        if (event.getTime() == null || event.getTime().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Event time is required"));
        }
        if (event.getVenue() == null || event.getVenue().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Venue is required"));
        }
        if (event.getTicketPrice() == null || event.getTicketPrice() < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Valid ticket price is required"));
        }
        if (event.getTotalSeats() == null || event.getTotalSeats() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Total seats must be greater than 0"));
        }

        // Initialize available seats if not provided
        if (event.getAvailableSeats() == null) {
            event.setAvailableSeats(event.getTotalSeats());
        }

        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Event with ID " + id + " not found"));
        }
        return ResponseEntity.ok(eventOpt.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event updatedData) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Event with ID " + id + " not found"));
        }

        Event event = eventOpt.get();
        if (updatedData.getName() != null) event.setName(updatedData.getName().trim());
        if (updatedData.getGame() != null) event.setGame(updatedData.getGame().trim());
        if (updatedData.getDescription() != null) event.setDescription(updatedData.getDescription().trim());
        if (updatedData.getDate() != null) event.setDate(updatedData.getDate().trim());
        if (updatedData.getTime() != null) event.setTime(updatedData.getTime().trim());
        if (updatedData.getVenue() != null) event.setVenue(updatedData.getVenue().trim());
        if (updatedData.getTicketPrice() != null) event.setTicketPrice(updatedData.getTicketPrice());
        
        if (updatedData.getTotalSeats() != null) {
            int difference = updatedData.getTotalSeats() - event.getTotalSeats();
            event.setTotalSeats(updatedData.getTotalSeats());
            event.setAvailableSeats(Math.max(0, event.getAvailableSeats() + difference));
        }
        if (updatedData.getAvailableSeats() != null) {
            event.setAvailableSeats(updatedData.getAvailableSeats());
        }

        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Event with ID " + id + " not found"));
        }

        eventRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }
}
