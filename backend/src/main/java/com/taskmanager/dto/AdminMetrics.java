package com.taskmanager.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class AdminMetrics {
    private long totalUsers;
    private long totalAdmins;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
}
