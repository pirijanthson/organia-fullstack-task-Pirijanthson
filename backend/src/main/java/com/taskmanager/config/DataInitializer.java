// package com.taskmanager.config;

// import com.taskmanager.model.User;
// import com.taskmanager.repository.UserRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration
// public class DataInitializer {

//     @Bean
//     CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//         return args -> {
//             String adminEmail = "admin@gmail.com";
//             if (userRepository.findByEmail(adminEmail).isEmpty()) {
//                 User admin = new User();
//                 admin.setUsername("System Admin");
//                 admin.setEmail(adminEmail);
//                 admin.setPhone("0000000000");
//                 admin.setPassword(passwordEncoder.encode("admin123"));
//                 admin.setRole("ADMIN");
//                 userRepository.save(admin);
//                 System.out.println("Admin account created: admin@gmail.com / admin123");
//             }
//         };
//     }
// }
