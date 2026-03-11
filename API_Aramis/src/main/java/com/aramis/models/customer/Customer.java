package com.aramis.models.customer;

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
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerID;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer code;

    @Column(nullable = false)
    public Timestamp dateCreation;

    @Column(nullable = false)
    public Timestamp dateModification;
}
