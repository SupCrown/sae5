package com.aramis.models.support;

import com.aramis.models.order.Order;
import com.aramis.models.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
public class Support {
    // Getters Setters...
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supportId;

    // C'est ici qu'on va stocker le résultat de Main.java
    @Setter
    @Getter
    @Column(columnDefinition = "TEXT")
    private String nestedProductsPlacements;

    @Setter
    @Getter
    private String status;

    @Setter
    @Getter
    @ManyToOne
    @JoinColumn(name = "userid")
    private User preparedBy;

    @Setter
    @ManyToOne
    @JoinColumn(name = "orderid")
    private Order order;

    @Setter
    @Getter
    @Column(name = "typeid") // Correspond à la colonne NOT NULL en base
    private Integer typeId;

}