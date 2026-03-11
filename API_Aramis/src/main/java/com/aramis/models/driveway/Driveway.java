package com.aramis.models.driveway;

import com.aramis.models.product.Product;
import com.aramis.models.zone.Zone;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Driveway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer drivewayID;

    @Column(nullable = false)
    public String name;

    @ManyToOne
    @JoinColumn(nullable = false, name = "zoneid")
    private Zone zone;

    @Column(nullable = false)
    public Timestamp dateCreation;

    @Column(nullable = false)
    public Timestamp dateModification;
}

