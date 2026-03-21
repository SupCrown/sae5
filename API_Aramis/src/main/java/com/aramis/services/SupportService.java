package com.aramis.services;

import com.aramis.dto.ProductPlacement;
import com.aramis.models.contain.Contain;
import com.aramis.models.product.Product;
import com.aramis.models.supportType.SupportType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.skjolber.packing.api.*;
import com.github.skjolber.packing.packer.laff.LargestAreaFitFirstPackager;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class SupportService {

    public static List<ProductPlacement> calculateOptimisedSupport(List<Product> products, SupportType supportType) {
        List<BoxItem> boxItems = products.stream().map(Product::toBoxItem).toList();

        Container container = Container.newBuilder()
                .withSize(supportType.getInnerWidth(), supportType.getInnerLength(), supportType.getInnerHeight())
                .withMaxLoadWeight(1500)
                .build();

        List<ContainerItem> containerItems = ContainerItem
                .newListBuilder()
                .withContainer(container)
                .build();

        PackagerResult result;
        try (LargestAreaFitFirstPackager packager = LargestAreaFitFirstPackager
                .newBuilder()
                .build()) {

            result = packager
                    .newResultBuilder()
                    .withContainerItems(containerItems)
                    .withBoxItems(boxItems)
                    .build();
        }

        if (result.isSuccess()) {
            Container match = result.get(0);

            List<Placement> placements = match.getStack().getPlacements();
            List<ProductPlacement> productsPlacements = new ArrayList<>();
            for (Placement placement : placements) {
                productsPlacements.add(new ProductPlacement(placement, supportType));
            }
            return productsPlacements;

        } else {
            throw new RuntimeException("Impossible de calculer un position optimale pour les colis et le type de support.");
        }
    }

    public static List<ProductPlacement> clearNonPlacedProducts(List<ProductPlacement> currentProductPlacement, List<Integer> placedProductsIDs) {
        List<ProductPlacement> clearedProductPlacements = new ArrayList<>();
        for (ProductPlacement productPlacement : currentProductPlacement) {
            if (placedProductsIDs.contains(productPlacement.getProductId())) {
                clearedProductPlacements.add(productPlacement);
            }
        }
        return clearedProductPlacements;
    }

    public static List<Product> calculSupport(List<Product> products, List<Contain> contains) {
        List<Product> calculatedProducts = new ArrayList<>();
        for (Product product : products) {
            Contain contain = contains.stream().filter(filteredContain -> Objects.equals(filteredContain.getProduct().getProductID(), product.getProductID())).findFirst().orElse(null);
            if (contain != null) {
                int quantity = contain.isMissingItems() ? contain.getServedQuantity() : contain.getApprovedQuantity();
                for (int i = 0; i < quantity; i++) {
                    calculatedProducts.add(product.clone());
                }
            }
        }
        return  calculatedProducts;
    }

    public static List<ProductPlacement> deserializeNestedProductsPlacements(String nestedProductsPlacement) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(nestedProductsPlacement, new TypeReference<>() {});
    }
}
