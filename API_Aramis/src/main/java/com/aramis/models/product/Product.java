package com.aramis.models.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
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

}
