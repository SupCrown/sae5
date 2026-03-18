package com.aramis.models.support;

import com.aramis.models.order.Order;
import com.aramis.models.supportType.SupportType;
import com.aramis.models.user.User;
import com.aramis.utils.EPrepareStatus;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

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
    public Integer supportID;

    public String nestedProductsPlacements;

    private EPrepareStatus status;

    @ManyToOne
    @JoinColumn(nullable = true, name = "userid")
    private User preparedBy;

    @ManyToOne
    @JoinColumn(nullable = false, name = "orderid")
    private Order order;

    @ManyToOne
    @JoinColumn(nullable = false, name = "typeid")
    private SupportType type;

    @Column(nullable = false)
    public Timestamp dateCreation;

    @Column(nullable = false)
    public Timestamp dateModification;
}
