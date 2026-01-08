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
    public int WhiteCode;
    @Column(nullable = false)
    public int RedCode;
    @Column(nullable = false)
    public int GreenCode;
    @Column(nullable = false)
    public int YellowCode;
    @Column(nullable = false)
    public int BlueCode;
    @Column(nullable = false)
    public int DrivewayID;
    @Column(nullable = false)
    public int LevelID;
    @Column(nullable = false, unique = true)
    public int ProductID;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}

