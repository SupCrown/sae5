package com.aramis.models.product;

import com.aramis.models.customer.Customer;
import com.aramis.models.location.Location;
import com.github.skjolber.packing.api.Box;
import com.github.skjolber.packing.api.BoxItem;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Product {
    // Getters et Setters standard...
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productID;

    @Column(nullable = false)
    private Integer productCode;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(nullable = false)
    private String libelle;

    @Column(nullable = false)
    private Integer height;

    @Column(nullable = false)
    private Integer length;

    @Column(nullable = false)
    private Integer width;

    @ManyToOne
    @JoinColumn(nullable = false, name = "locationid")
    private Location location;

    public BoxItem toBoxItem() {
        return new BoxItem(Box.newBuilder().withId(this.productID.toString()).withSize(this.width, this.length, this.height).withWeight(1).withRotate3D().build());
    }

    public Product clone() {
        return new Product(productID, productCode, quantity, libelle, height, length, width, location);
    }
}
