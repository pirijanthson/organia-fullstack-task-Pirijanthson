package com.taskmanager.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.taskmanager.model.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByUserId(Long userId);
    long countByStatus(com.taskmanager.model.Status status);
}
