package com.aramis.models.support;

import com.aramis.models.order.Order;
import com.aramis.models.supportType.SupportType;
import com.aramis.models.user.User;
import com.aramis.utils.EPrepareStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.*;

import java.sql.Timestamp;
import java.sql.Date;
import java.util.Objects;

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

    @Column(columnDefinition="text")
    public String nestedProductsPlacements;

    private EPrepareStatus status;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(nullable = false, name = "orderid")
    private Order order;

    @ManyToOne
    @JoinColumn(nullable = false, name = "typeid")
    private SupportType type;

    @Column(nullable = true)
    public Date datePreparation;

    @Column(nullable = false)
    public Timestamp dateCreation;

    @Column(nullable = false)
    public Timestamp dateModification;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Support support = (Support) o;
        return Objects.equals(supportID, support.supportID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(supportID);
    }
}
