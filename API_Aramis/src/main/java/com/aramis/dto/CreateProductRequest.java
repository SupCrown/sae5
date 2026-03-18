package com.aramis.dto;

import com.aramis.models.location.Location;
import com.aramis.models.product.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {
    @NotNull
    private Integer productCode;
    @NotNull
    private Integer quantity;
    @NotBlank
    private String libel;
    @NotNull
    private Integer height;
    @NotNull
    private Integer length;
    @NotNull
    private Integer width;
    @NotBlank
    private String zone;
    @NotBlank
    private String driveway;
    @NotBlank
    private String location;
    @NotBlank
    private String level;

    public Product toProduct(Location location) {
        Product product =  new Product();
        product.setProductCode(productCode);
        product.setQuantity(quantity);
        product.setLibelle(libel);
        product.setWidth(width);
        product.setLength(length);
        product.setHeight(height);
        product.setLocation(location);

        return product;
    }
}
