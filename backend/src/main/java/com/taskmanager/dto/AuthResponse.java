package com.taskmanager.dto;
import lombok.*;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private Long userId;
    private String role;
}
