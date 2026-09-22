package com.gamingevent.platform.controller;

import com.gamingevent.platform.model.Booking;
import com.gamingevent.platform.model.Event;
import com.gamingevent.platform.model.User;
import com.gamingevent.platform.repository.BookingRepository;
import com.gamingevent.platform.repository.EventRepository;
import com.gamingevent.platform.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public BookingController(BookingRepository bookingRepository,
                             UserRepository userRepository,
                             EventRepository eventRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking bookingRequest) {
        if (bookingRequest.getUserId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User ID is required"));
        }
        if (bookingRequest.getEventId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Event ID is required"));
        }
        if (bookingRequest.getTickets() == null || bookingRequest.getTickets() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tickets must be at least 1"));
        }

        // 1. Check whether the user exists
        Optional<User> userOpt = userRepository.findById(bookingRequest.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User with ID " + bookingRequest.getUserId() + " not found"));
        }
        User user = userOpt.get();

        // 2. Check whether the event exists
        Optional<Event> eventOpt = eventRepository.findById(bookingRequest.getEventId());
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Event with ID " + bookingRequest.getEventId() + " not found"));
        }
        Event event = eventOpt.get();

        // 3. Check whether enough seats are available
        int requestedTickets = bookingRequest.getTickets();
        if (event.getAvailableSeats() < requestedTickets) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Not enough available seats. Only " + event.getAvailableSeats() + " ticket(s) remaining."));
        }

        // 4. Calculate totalAmount = tickets * ticketPrice
        double totalAmount = requestedTickets * event.getTicketPrice();

        // 5. Set booking details and status to CONFIRMED
        Booking booking = new Booking();
        booking.setUserId(user.getId());
        booking.setEventId(event.getId());
        booking.setUserName(user.getName());
        booking.setEventName(event.getName());
        booking.setTickets(requestedTickets);
        booking.setTotalAmount(totalAmount);
        booking.setStatus("CONFIRMED");

        // 6. Reduce the event's available seats
        event.setAvailableSeats(event.getAvailableSeats() - requestedTickets);
        eventRepository.save(event);

        // 7. Save the booking
        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Booking with ID " + id + " not found"));
        }
        return ResponseEntity.ok(bookingOpt.get());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {
        List<Booking> userBookings = bookingRepository.findByUserId(userId);
        return ResponseEntity.ok(userBookings);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        // 1. Find the booking
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Booking with ID " + id + " not found"));
        }
        Booking booking = bookingOpt.get();

        // 2. Check that it is not already cancelled
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "This booking is already cancelled."));
        }

        // 3. Return the booked seats to the event
        Optional<Event> eventOpt = eventRepository.findById(booking.getEventId());
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            event.setAvailableSeats(event.getAvailableSeats() + booking.getTickets());
            eventRepository.save(event);
        }

        // 4. Change status to CANCELLED
        booking.setStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(Map.of(
                "message", "Booking cancelled successfully. " + booking.getTickets() + " seat(s) restored to the event.",
                "booking", updatedBooking
        ));
    }
}
