package com.taskmanager.service;

import com.taskmanager.model.Note;
import com.taskmanager.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;

    public List<Note> getAllNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId);
    }

    public List<Note> getNotesByTaskId(Long taskId) {
        return noteRepository.findByTaskId(taskId);
    }

    public Note createNote(Note note) {
        validateSubHeadings(note);
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Note noteDetails) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        
        validateSubHeadings(noteDetails);
        
        note.setDate(noteDetails.getDate());
        note.setHeading(noteDetails.getHeading());
        note.setSubHeadings(noteDetails.getSubHeadings());
        note.setDescription(noteDetails.getDescription());
        note.setTaskId(noteDetails.getTaskId());
        
        return noteRepository.save(note);
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    private void validateSubHeadings(Note note) {
        if (note.getSubHeadings() != null && note.getSubHeadings().size() > 10) {
            throw new RuntimeException("A maximum of 10 subheadings can be added for a single note.");
        }
    }
}
