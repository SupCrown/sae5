package com.aramis.models.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "_order")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private int status;

    // --- NOUVEAU CHAMP : BOOLEEN DE PRIORITE ---
    @Column(name = "priority", columnDefinition = "boolean default false")
    private boolean priority;

    public Order() {
    }
}