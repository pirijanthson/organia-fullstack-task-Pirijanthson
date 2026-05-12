package com.taskmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "admin_notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String heading;

    @ElementCollection
    @CollectionTable(name = "admin_note_subheadings", joinColumns = @JoinColumn(name = "admin_note_id"))
    @Column(name = "subheading")
    private List<String> subHeadings;

    @Column(columnDefinition = "TEXT")
    private String description;
}
