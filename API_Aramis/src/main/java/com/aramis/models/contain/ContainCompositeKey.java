package com.aramis.models.contain;

import java.io.Serializable;
import java.util.Objects;

public class ContainCompositeKey implements Serializable {
    public int ProductID;
    public int SupportID;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ContainCompositeKey that = (ContainCompositeKey) o;
        return ProductID == that.ProductID && SupportID == that.SupportID;
    }

    @Override
    public int hashCode() {
        return Objects.hash(ProductID, SupportID);
    }
}
