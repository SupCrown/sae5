package com.aramis.models.contain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@IdClass(ContainCompositeKey.class)
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

