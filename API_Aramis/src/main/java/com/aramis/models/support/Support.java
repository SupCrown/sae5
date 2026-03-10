package com.aramis.models.support;

import com.aramis.models.order.Order;
import com.aramis.models.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Support {
    // Getters Setters...
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer SupportID;
    public String NestedProductsPlacement;
    @Column(nullable = false)
    public Integer TypeID;
    public Integer UserID;
    @Column(nullable = false)
    public Integer OrderID;
    @Column(nullable = false)
    public Timestamp DateCreation;
    @Column(nullable = false)
    public Timestamp DateModification;
}
