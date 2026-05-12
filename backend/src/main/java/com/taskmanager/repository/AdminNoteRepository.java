package com.taskmanager.repository;

import com.taskmanager.model.AdminNote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminNoteRepository extends JpaRepository<AdminNote, Long> {
}
