package com.taskmanager.security;

import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Constructor Injection (BEST PRACTICE)
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 1. Find user from DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email)
                );

        // 2. Convert to Spring Security User
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),        // username (email)
                user.getPassword(),     // hashed password
                new ArrayList<>()       // roles/authorities (empty for now)
        );
    }
}