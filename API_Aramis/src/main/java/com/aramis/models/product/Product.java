package com.aramis.models.product;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.Date;

@Getter
@Entity
public class Product {
    // Getters et Setters standard...
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String productCode;

    // Dimensions pour l'algorithme (en cm par exemple)
    private int width;
    private int height;
    private int length;
    private int weight; // en grammes

    // Ajoute les setters...
}