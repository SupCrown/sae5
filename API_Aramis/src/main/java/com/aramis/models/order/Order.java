package com.aramis.models.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Entity(name = "_order")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int OrderID;
    public Date OrderDate;
    @Column(nullable = false)
    public EOrderStatus Status;
    @Column(nullable = false)
    public int CustomerID;
}

