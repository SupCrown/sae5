package com.aramis.models.order;

import jakarta.persistence.*;
import lombok.*;

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
    public EOrderStatus Status;
    @Column(nullable = false)
    public int CustomerID;
    public boolean IsAPriority;
    public Timestamp PriorityModificationDate;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}

