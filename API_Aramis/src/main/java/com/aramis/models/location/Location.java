package com.aramis.models.location;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int LocationID;
    @Column(nullable = false)
    public String LocationCode;
    @Column(nullable = false)
    public int DrivewayID;
    @Column(nullable = false)
    public int LevelID;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}

