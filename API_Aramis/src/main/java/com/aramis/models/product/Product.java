package com.aramis.models.product;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ProductID;
    @Column(nullable = false)
    private int ProductCode;
    @Column(nullable = false)
    private int Height;
    @Column(nullable = false)
    private int Length;
    @Column(nullable = false)
    private int Width;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}
