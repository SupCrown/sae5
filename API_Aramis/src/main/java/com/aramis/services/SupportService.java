package com.aramis.services;

import com.aramis.dto.ProductPlacement;
import com.aramis.models.product.Product;
import com.aramis.models.supportType.SupportType;
import com.github.skjolber.packing.api.*;
import com.github.skjolber.packing.packer.laff.LargestAreaFitFirstPackager;

import java.util.ArrayList;
import java.util.List;

public class SupportService {

    public static List<ProductPlacement> calculateOptimisedSupport(List<Product> products, SupportType supportType) {
        List<BoxItem> boxItems = products.stream().map(Product::toBoxItem).toList();

        Container container = Container.newBuilder()
            .withSize(supportType.getInnerWidth(), supportType.getInnerLength(), supportType.getInnerHeight())
            .withMaxLoadWeight(1500)
            .build();

        return getProductPlacements(container, boxItems);
    }

    public static List<ProductPlacement> calculatePartialOptimisedSupport(List<Product> products, Stack alreadyPlacedProducts, SupportType supportType) {
        List<BoxItem> boxItems = products.stream().map(Product::toBoxItem).toList();

        Container container = Container.newBuilder()
                .withSize(supportType.getInnerWidth(), supportType.getInnerLength(), supportType.getInnerHeight())
                .withMaxLoadWeight(1500)
                .withStack(alreadyPlacedProducts)
                .build();

        return getProductPlacements(container, boxItems);
    }

    private static List<ProductPlacement> getProductPlacements(Container container, List<BoxItem> boxItems) {
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
                System.out.println(placement);
                productsPlacements.add(new ProductPlacement(placement));
            }

            return productsPlacements;
        } else {
            throw new RuntimeException("Impossible de calculer un position optimale pour les colis et le type de support.");
        }
    }

    public static List<ProductPlacement> clearAlreadyPlacedProducts(List<ProductPlacement> currentProductPlacement, List<Integer> placedProductsIDs) {
        List<ProductPlacement> clearedProductPlacements = new ArrayList<>();
        for (ProductPlacement productPlacement : currentProductPlacement) {
            if (placedProductsIDs.contains(productPlacement.getProductId())) {
                clearedProductPlacements.add(productPlacement);
            }
        }
        return cl
    }
}
