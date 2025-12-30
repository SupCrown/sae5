package com.aramis.models.contain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.Getter;
import lombok.Setter;

@Entity
@IdClass(ContainCompositeKey.class)
@Getter
@Setter
public class Contain {
    @Id
    public int ProductID;
    @Id
    public int SupportID;
    public int ServedQuantity;
    public int ApprovedQuantity;
    public boolean MissingItems;
}

