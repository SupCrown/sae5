package com.aramis.models.support;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Support {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int SupportID;
    public String NestedProductsPlacement;
    @Column(nullable = false)
    public int TypeID;
    @Column(nullable = false)
    public int UserID;
    @Column(nullable = false)
    public int OrderID;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}
