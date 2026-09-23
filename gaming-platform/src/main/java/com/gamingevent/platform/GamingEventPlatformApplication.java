package com.gamingevent.platform;

import com.gamingevent.platform.model.Booking;
import com.gamingevent.platform.model.Event;
import com.gamingevent.platform.model.User;
import com.gamingevent.platform.repository.BookingRepository;
import com.gamingevent.platform.repository.EventRepository;
import com.gamingevent.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.List;

@SpringBootApplication
@EnableAsync
public class GamingEventPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(GamingEventPlatformApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      EventRepository eventRepository,
                                      BookingRepository bookingRepository,
                                      @Value("${app.seed.admin-email:admin@gaming.com}") String adminEmail,
                                      @Value("${app.seed.user-email:alex@gaming.com}") String userEmail) {
        return args -> {
            // 1. Seed Demo Users
            User admin = userRepository.findByEmail(adminEmail).orElseGet(() ->
                userRepository.save(new User("Admin Director", adminEmail, "admin123", "ADMIN"))
            );
            User gamer1 = userRepository.findByEmail(userEmail).orElseGet(() ->
                userRepository.save(new User("Alex Gamer", userEmail, "alex123", "USER"))
            );
            User gamer2 = userRepository.findByEmail("sarah@gaming.com").orElseGet(() ->
                userRepository.save(new User("Sarah Pro", "sarah@gaming.com", "sarah123", "USER"))
            );
            User gamer3 = userRepository.findByEmail("vikram@gaming.com").orElseGet(() ->
                userRepository.save(new User("Vikram Esports", "vikram@gaming.com", "vikram123", "USER"))
            );
            User gamer4 = userRepository.findByEmail("marcus@gaming.com").orElseGet(() ->
                userRepository.save(new User("Marcus Phoenix", "marcus@gaming.com", "marcus123", "USER"))
            );
            System.out.println(">>> Demo users verified/seeded.");

            // 2. Seed 8 Tournaments
            List<Event> sampleEvents = List.of(
                new Event(
                    "Valorant Champions LAN 2026",
                    "Valorant",
                    "5v5 Tactical Shooter national championship featuring top esports teams and live crowd finals.",
                    "2026-10-15",
                    "18:00",
                    "Esports Arena, Hall 1, Mumbai",
                    499.0,
                    150,
                    148
                ),
                new Event(
                    "CS2 Masters Premier Tournament",
                    "Counter-Strike 2",
                    "Premier CS2 major qualifier with live casting, pro player meetups, and exclusive gaming loot.",
                    "2026-10-22",
                    "17:00",
                    "CyberHub Gaming Dome, Bangalore",
                    799.0,
                    200,
                    199
                ),
                new Event(
                    "EA Sports FC 25 Showdown",
                    "EA Sports FC 25",
                    "Fast-paced 1v1 console soccer showdown with dynamic leaderboard brackets and grand trophy.",
                    "2026-11-05",
                    "15:00",
                    "TechZone Arena, Hyderabad",
                    299.0,
                    100,
                    99
                ),
                new Event(
                    "Apex Legends Battle Royale Clash",
                    "Apex Legends",
                    "Trios tournament battle across 6 drop matches to determine the Apex Champions.",
                    "2026-11-18",
                    "16:30",
                    "Nexus Esports Lounge, Delhi NCR",
                    399.0,
                    120,
                    120
                ),
                new Event(
                    "BGMI Pro Invitational 2026",
                    "BGMI",
                    "High-stakes squad mobile battle royale championship with 24 invited franchised teams.",
                    "2026-11-25",
                    "14:00",
                    "Shivaji Stadium Dome, Pune",
                    349.0,
                    250,
                    247
                ),
                new Event(
                    "Tekken 8 Iron Fist Championship",
                    "Tekken 8",
                    "Double-elimination fighting game arena tournament with high-refresh monitors and arcade sticks.",
                    "2026-12-02",
                    "16:00",
                    "Phoenix Gaming Hub, Chennai",
                    249.0,
                    80,
                    79
                ),
                new Event(
                    "Rocket League Super Cup",
                    "Rocket League",
                    "High-flying 3v3 vehicular soccer championship with live grand finals and merchandise giveaways.",
                    "2026-12-10",
                    "18:00",
                    "Metropolis Arena, Kolkata",
                    199.0,
                    90,
                    90
                ),
                new Event(
                    "Dota 2 Aegis Champions League",
                    "Dota 2",
                    "Intense 5v5 MOBA LAN bracket featuring the country's most strategic competitive rosters.",
                    "2026-12-18",
                    "17:30",
                    "Indiranagar LAN Center, Bengaluru",
                    599.0,
                    160,
                    160
                )
            );

            for (Event event : sampleEvents) {
                if (!eventRepository.existsByName(event.getName())) {
                    eventRepository.save(event);
                }
            }
            System.out.println(">>> Sample esports tournaments verified/seeded.");

            // 3. Seed Sample Confirmed Bookings if empty
            if (bookingRepository.count() == 0) {
                List<Event> allEvents = eventRepository.findAll();
                if (!allEvents.isEmpty()) {
                    Event ev1 = allEvents.get(0);
                    bookingRepository.save(new Booking(gamer1.getId(), ev1.getId(), gamer1.getName(), ev1.getName(), 2, ev1.getTicketPrice() * 2, "CONFIRMED"));

                    if (allEvents.size() > 1) {
                        Event ev2 = allEvents.get(1);
                        bookingRepository.save(new Booking(gamer2.getId(), ev2.getId(), gamer2.getName(), ev2.getName(), 1, ev2.getTicketPrice(), "CONFIRMED"));
                    }
                    if (allEvents.size() > 2) {
                        Event ev3 = allEvents.get(2);
                        bookingRepository.save(new Booking(gamer4.getId(), ev3.getId(), gamer4.getName(), ev3.getName(), 1, ev3.getTicketPrice(), "CONFIRMED"));
                    }
                    if (allEvents.size() > 4) {
                        Event ev5 = allEvents.get(4);
                        bookingRepository.save(new Booking(gamer3.getId(), ev5.getId(), gamer3.getName(), ev5.getName(), 3, ev5.getTicketPrice() * 3, "CONFIRMED"));
                    }
                    if (allEvents.size() > 5) {
                        Event ev6 = allEvents.get(5);
                        bookingRepository.save(new Booking(gamer1.getId(), ev6.getId(), gamer1.getName(), ev6.getName(), 1, ev6.getTicketPrice(), "CONFIRMED"));
                    }
                    System.out.println(">>> Sample bookings seeded successfully.");
                }
            }
        };
    }
}
