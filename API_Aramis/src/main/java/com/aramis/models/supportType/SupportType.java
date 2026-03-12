package com.aramis.models.supportType;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
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
    private Integer typeID;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private Integer innerWidth;

    @Column(nullable = false)
    private Integer innerLength;

    @Column(nullable = false)
    private Integer innerHeight;

    @Column(nullable = false)
    public Timestamp dateCreation;

    @Column(nullable = false)
    public Timestamp dateModification;
}
