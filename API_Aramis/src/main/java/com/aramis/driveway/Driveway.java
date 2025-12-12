package com.aramis.driveway;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Driveway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long DrivewayID;
    @Column(nullable = false)
    private String Name;
}

