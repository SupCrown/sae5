package com.aramis.models.support;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
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
}
