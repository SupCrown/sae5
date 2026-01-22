package com.aramis.services;

import com.aramis.models.product.Product;
import com.aramis.models.supportType.SupportType;
import com.github.skjolber.packing.api.*;
import com.github.skjolber.packing.packer.laff.LargestAreaFitFirstPackager;

import java.util.List;

public class SupportService {

    public static List<Placement> calculateOptimisedSupport(List<Product> products, SupportType supportType) {
        List<BoxItem> boxItems = products.stream().map(Product::toBoxItem).toList();

        Container container = Container.newBuilder()
            .withSize(supportType.getInnerWidth(), supportType.getInnerLength(), supportType.getInnerHeight())
            //.withStack() objets déjà placés
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

            for (Placement placement : placements) {
                System.out.println(placement);
//                System.out.println(placement.getAbsoluteX());
//                System.out.println(placement.getAbsoluteY());
//                System.out.println(placement.getAbsoluteZ());
            }

            return placements;
        } else {
            throw new RuntimeException("Impossible de calculer un position optimale pour les colis et le type de support.");
        }
    }
}
