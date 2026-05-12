package com.taskmanager.service;

import org.springframework.stereotype.Service;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.model.Task;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setDueDate(updatedTask.getDueDate());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getTasksByUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findAll().stream()
                .filter(task -> task.getStatus().name().equalsIgnoreCase(status))
                .toList();
    }

    public List<Task> getTasksByDueDate(String dueDate) {
        return taskRepository.findAll().stream()
                .filter(task -> task.getDueDate().equals(dueDate))
                .toList();
    }

    public List<Task> getTasksBySearch(String param) {
        return taskRepository.findAll().stream()
                .filter(task -> task.getTitle().toLowerCase().contains(param.toLowerCase()) ||
                                task.getDescription().toLowerCase().contains(param.toLowerCase()))
                .toList();
    }
}
