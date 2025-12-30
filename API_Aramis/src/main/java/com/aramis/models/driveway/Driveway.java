package com.aramis.models.driveway;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Driveway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long DrivewayID;
    @Column(nullable = false)
    public String Name;
    @Column(nullable = false)
    public int ZoneID;
}

