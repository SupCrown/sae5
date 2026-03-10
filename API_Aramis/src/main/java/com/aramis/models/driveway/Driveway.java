package com.aramis.models.driveway;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Driveway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long DrivewayID;
    @Column(nullable = false)
    public String Name;
    @Column(nullable = false)
    public int ZoneID;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}

