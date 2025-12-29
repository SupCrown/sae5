package com.aramis.supportType;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class SupportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long TypeID;
    @Column(nullable = false)
    private String Label;
    @Column(nullable = false)
    private int Capacity;
}
