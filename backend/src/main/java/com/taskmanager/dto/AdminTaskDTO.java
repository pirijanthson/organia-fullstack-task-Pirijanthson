package com.taskmanager.dto;

import com.taskmanager.model.Status;
import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminTaskDTO {
    private Long id;
    private String title;
    private String description;
    private Status status;
    private LocalDate dueDate;
    private Long userId;
    private String userName;
    private String feedback;
}
