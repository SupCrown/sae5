package com.aramis.models.supportType;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long TypeID;
    @Column(nullable = false)
    private String Label;
    @Column(nullable = false)
    private int Capacity;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}
