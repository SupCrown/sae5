package com.aramis.models.product;

import com.github.skjolber.packing.api.Box;
import com.github.skjolber.packing.api.BoxItem;
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
    private String Libelle;
    @Column(nullable = false)
    private int Height;
    @Column(nullable = false)
    private int Length;
    @Column(nullable = false)
    private int Width;
    @Column(nullable = false)
    private int LocationID;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;

    public BoxItem toBoxItem() {
        return new BoxItem(Box.newBuilder().withId(this.ProductID.toString()).withSize(this.Width, this.Length, this.Height).withWeight(1).withRotate3D().build());
    }
}
