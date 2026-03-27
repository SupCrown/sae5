package com.aramis.dto;

import com.aramis.models.location.Location;
import com.aramis.models.product.Product;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ProductSupportFormBD extends Product {
    Integer supportQuantity;

    public ProductSupportFormBD(Integer productID, Integer productCode, Integer quantity, String libelle, Integer height, Integer length, Integer width, Location location, Integer supportQuantity) {
        super(productID, productCode, quantity, libelle, height, length, width, location);
        this.supportQuantity = supportQuantity;
    }

    public ProductSupportFormBD(Product product, Integer supportQuantity) {
        super(product.getProductID(), product.getProductCode(), product.getQuantity(), product.getLibelle(), product.getHeight(), product.getLength(), product.getWidth(), product.getLocation());
        this.supportQuantity = supportQuantity;
    }

    public Product toProduct() {
        return super.clone();
    }
}
