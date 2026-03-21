package com.aramis.dto;

import com.aramis.models.product.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSupportResponse extends ProductResponse {
    int supportQuantity;

    public ProductSupportResponse(Product product, Integer supportQuantity) {
        super(product);
        this.supportQuantity = supportQuantity;
    }
}
