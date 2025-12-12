package com.aramis.zone;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Zone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ZoneID;
    @Column(nullable = false)
    private String ZoneName;
}
