package com.aramis.models.order;

import jakarta.persistence.*;
import lombok.*;
import com.aramis.models.product.*; // Ou ton import correct pour Product

import java.sql.Date;
import java.sql.Timestamp;

@Entity(name = "_order")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int OrderID;
    public Date OrderDate;
    @Column(nullable = false)
    public int Status;
    @Column(nullable = false)
    public int CustomerID;
    @Column(name = "priority", columnDefinition = "boolean default false")
    private boolean priority;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}