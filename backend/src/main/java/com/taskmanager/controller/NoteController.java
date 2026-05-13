package com.taskmanager.controller;

import com.taskmanager.model.Note;
import com.taskmanager.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/TMS/notes")
@CrossOrigin(origins = "*")
public class NoteController {
    @Autowired
    private NoteService noteService;

    @GetMapping
    public List<Note> getNotesByUserId(@RequestParam Long userId) {
        return noteService.getAllNotesByUserId(userId);
    }

    @GetMapping("/task/{taskId}")
    public List<Note> getNotesByTaskId(@PathVariable Long taskId) {
        return noteService.getNotesByTaskId(taskId);
    }

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return noteService.createNote(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        return ResponseEntity.ok(noteService.updateNote(id, noteDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok().build();
    }
}
