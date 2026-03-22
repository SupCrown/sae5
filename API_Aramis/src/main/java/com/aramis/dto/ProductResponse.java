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
public class ProductResponse {
    private Integer productID;
    private Integer productCode;
    private Integer quantity;
    private String libel;
    private Integer height;
    private Integer length;
    private Integer width;
    private String location;
    private String driveway;
    private String zone;
    private Integer level;

    public ProductResponse(Product product) {
        productID = product.getProductID();
        productCode = product.getProductCode();
        quantity = product.getQuantity();
        libel = product.getLibelle();
        height = product.getHeight();
        length = product.getLength();
        width = product.getWidth();
        location = product.getLocation().getLocationCode();
        driveway = product.getLocation().getDriveway().getName();
        zone = product.getLocation().getDriveway().getZone().getZoneName();
        level = product.getLocation().getLevel().getLevelValue();
    }
}
