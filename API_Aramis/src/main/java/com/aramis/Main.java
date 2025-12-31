package com.aramis;

import com.github.skjolber.packing.api.*;
import com.github.skjolber.packing.packer.laff.LargestAreaFitFirstPackager;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<BoxItem> products = new ArrayList<>();

        products.add(new BoxItem(Box.newBuilder().withId("Shoes").withSize(6, 10, 2).withRotate3D().withWeight(25).build(), 1));
        products.add(new BoxItem(Box.newBuilder().withId("Pants").withSize(4, 10, 1).withRotate3D().withWeight(25).build(), 1));
        products.add(new BoxItem(Box.newBuilder().withId("Hat").withSize(4, 10, 2).withRotate3D().withWeight(50).build(), 1));

// add a single container type
        Container container = Container.newBuilder()
                .withDescription("1")
                .withSize(10, 10, 3)
                .withEmptyWeight(1)
                .withMaxLoadWeight(100)
                .build();

// with unlimited number of containers available
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
                    .withBoxItems(products)
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
        }
    }
}


