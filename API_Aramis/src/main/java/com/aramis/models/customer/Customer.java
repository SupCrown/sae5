package com.aramis.models.customer;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long CustomerID;
    @Column(nullable = false)
    private String Name;
    @Column(nullable = false)
    private int code;
}
