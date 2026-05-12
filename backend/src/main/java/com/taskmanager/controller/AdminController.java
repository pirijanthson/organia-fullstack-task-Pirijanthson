package com.taskmanager.controller;

import com.taskmanager.dto.AdminMetrics;
import com.taskmanager.dto.AdminTaskDTO;
import com.taskmanager.model.*;
import com.taskmanager.repository.*;
import com.taskmanager.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminNoteRepository adminNoteRepository;

    @GetMapping("/metrics")
    public ResponseEntity<AdminMetrics> getMetrics() {
        long totalUsers = userRepository.countByRole("USER");
        long totalAdmins = userRepository.countByRole("ADMIN");
        long totalTasks = taskRepository.count();
        long completed = taskRepository.countByStatus(Status.DONE);
        long inProgress = taskRepository.countByStatus(Status.IN_PROGRESS);
        long pending = taskRepository.countByStatus(Status.TODO);

        return ResponseEntity.ok(new AdminMetrics(totalUsers, totalAdmins, totalTasks, completed, pending, inProgress));
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<AdminTaskDTO>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        List<User> users = userRepository.findAll();

        List<AdminTaskDTO> dtos = tasks.stream().map(task -> {
            String userName = users.stream()
                    .filter(u -> u.getId().equals(task.getUserId()))
                    .findFirst()
                    .map(User::getUsername)
                    .orElse("Unknown");
            
            return new AdminTaskDTO(
                    task.getId(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getStatus(),
                    task.getDueDate(),
                    task.getUserId(),
                    userName,
                    task.getFeedback()
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> assignTask(@RequestBody Task task) {
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setDueDate(taskDetails.getDueDate());
        task.setUserId(taskDetails.getUserId());
        
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Admin Specific Notes
    @GetMapping("/notes")
    public List<AdminNote> getAdminNotes() {
        return adminNoteRepository.findAll();
    }

    @PostMapping("/notes")
    public AdminNote createAdminNote(@RequestBody AdminNote note) {
        return adminNoteRepository.save(note);
    }

    @PutMapping("/notes/{id}")
    public AdminNote updateAdminNote(@PathVariable Long id, @RequestBody AdminNote noteDetails) {
        AdminNote note = adminNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        note.setDate(noteDetails.getDate());
        note.setHeading(noteDetails.getHeading());
        note.setSubHeadings(noteDetails.getSubHeadings());
        note.setDescription(noteDetails.getDescription());
        return adminNoteRepository.save(note);
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteAdminNote(@PathVariable Long id) {
        adminNoteRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
