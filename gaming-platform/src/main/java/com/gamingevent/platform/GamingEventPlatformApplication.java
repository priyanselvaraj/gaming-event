package com.gamingevent.platform;

import com.gamingevent.platform.model.Event;
import com.gamingevent.platform.model.User;
import com.gamingevent.platform.repository.EventRepository;
import com.gamingevent.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class GamingEventPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(GamingEventPlatformApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, EventRepository eventRepository,
                                      @Value("${app.seed.admin-email:admin@gaming.com}") String adminEmail,
                                      @Value("${app.seed.user-email:alex@gaming.com}") String userEmail) {
        return args -> {
            // Seed Admin and Demo User if no users exist
            if (userRepository.count() == 0) {
                User admin = new User("Admin", adminEmail, "admin123", "ADMIN");
                User gamer = new User("Alex Gamer", userEmail, "alex123", "USER");
                userRepository.save(admin);
                userRepository.save(gamer);
                System.out.println(">>> Seeded default admin (" + adminEmail + ") and user (" + userEmail + ")");
            }

            // Seed Sample Gaming Events if none exist
            if (eventRepository.count() == 0) {
                Event e1 = new Event(
                    "Valorant Champions LAN 2026",
                    "Valorant",
                    "5v5 Tactical Shooter national championship featuring top esports teams and live crowd finals.",
                    "2026-10-15",
                    "18:00",
                    "Esports Arena, Hall 1, Mumbai",
                    499.0,
                    150,
                    150
                );

                Event e2 = new Event(
                    "CS2 Masters Premier Tournament",
                    "Counter-Strike 2",
                    "Premier CS2 major qualifier with live casting, pro player meetups, and exclusive gaming loot.",
                    "2026-10-22",
                    "17:00",
                    "CyberHub Gaming Dome, Bangalore",
                    799.0,
                    200,
                    200
                );

                Event e3 = new Event(
                    "EA Sports FC 25 Showdown",
                    "EA Sports FC 25",
                    "Fast-paced 1v1 console soccer showdown with dynamic leaderboard brackets and grand trophy.",
                    "2026-11-05",
                    "15:00",
                    "TechZone Arena, Hyderabad",
                    299.0,
                    100,
                    100
                );

                Event e4 = new Event(
                    "Apex Legends Battle Royale Clash",
                    "Apex Legends",
                    "Trios tournament battle across 6 drop matches to determine the Apex Champions.",
                    "2026-11-18",
                    "16:30",
                    "Nexus Esports Lounge, Delhi NCR",
                    399.0,
                    120,
                    120
                );

                eventRepository.save(e1);
                eventRepository.save(e2);
                eventRepository.save(e3);
                eventRepository.save(e4);
                System.out.println(">>> Seeded 4 initial gaming events.");
            }
        };
    }
}
