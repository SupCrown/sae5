package com.aramis.models.order;

import com.aramis.models.customer.Customer;
import com.aramis.models.level.Level;
import com.aramis.utils.EPrepareStatus;
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
    public Integer orderID;

    public Date orderDate;

    @Column(nullable = false)
    public EPrepareStatus Status;

    @ManyToOne
    @JoinColumn(nullable = false, name = "customerid")
    private Customer customer;

    @Column(name = "priority", columnDefinition = "boolean default false")
    private boolean priority;

    @Transient
    public Timestamp dateCreation;

    @Transient
    public Timestamp dateModification;
}