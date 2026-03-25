package com.aramis.dto;

import com.aramis.models.contain.Contain;
import com.aramis.models.product.Product;
import com.aramis.models.support.Support;
import jakarta.validation.Configuration;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSupportRequest {
    @NotNull
    private Integer productID;
    @NotNull
    private Integer quantity;

    public Contain toContain(Product product, Support support) {
        Timestamp now = new Timestamp(System.currentTimeMillis());

        Contain contain = new Contain();
        contain.setProduct(product);
        contain.setSupport(support);
        contain.setApprovedQuantity(0);
        contain.setApprovedQuantity(quantity);
        contain.setDateCreation(now);
        contain.setDateModification(now);

        return contain;
    }
}
