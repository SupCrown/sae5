package com.aramis.models.contain;

import com.aramis.models.product.Product;
import com.aramis.models.support.Support;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Contain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "supportid")
    private Support support;

    @ManyToOne
    @JoinColumn(name = "productid")
    private Product product;

    private int servedQuantity;

    private int approvedQuantity;

    // --- CORRECTION : AJOUT DU CHAMP MANQUANT ---
    @Column(name = "missing_items") // Attention à l'underscore ici, l'erreur l'indiquait explicitement
    private boolean missingItems;
}