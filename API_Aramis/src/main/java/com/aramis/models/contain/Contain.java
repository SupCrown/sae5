package com.aramis.models.contain;

import com.aramis.models.product.Product;
import com.aramis.models.support.Support;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer containID;

    @ManyToOne
    @JoinColumn(name = "supportid")
    private Support support;

    @ManyToOne
    @JoinColumn(name = "productid")
    private Product product;

    public Integer servedQuantity;

    public Integer approvedQuantity;

    private boolean missingItems;

    @Column(nullable = false)
    public Timestamp dateCreation;

    @Column(nullable = false)
    public Timestamp dateModification;
}