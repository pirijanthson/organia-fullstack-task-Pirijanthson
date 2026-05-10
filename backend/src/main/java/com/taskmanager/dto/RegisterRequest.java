package com.taskmanager.dto;
import lombok.*;

@Data
public class RegisterRequest {
    private String username;
    private String phone;
    private String email;
    private String password;
}
