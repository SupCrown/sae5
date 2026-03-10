package com.aramis.models.contain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contain {
    @Id
    public int ProductID;
    @Id
    public int SupportID;
    public int ServedQuantity;
    public int ApprovedQuantity;
    public boolean MissingItems;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}

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
