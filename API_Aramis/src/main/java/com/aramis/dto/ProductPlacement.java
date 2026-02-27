package com.aramis.dto;

import com.github.skjolber.packing.api.BoxStackValue;
import com.github.skjolber.packing.api.Placement;
import com.github.skjolber.packing.ep.points3d.Default3DPlanePoint3D;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Jacksonized
public class ProductPlacement {
    int productId;
    int x;
    int y;
    int z;
    int width;
    int length;
    int height;
    List<Surface> surfaces;

    public ProductPlacement(Placement placement) {
        productId = Integer.parseInt(placement.getBoxItem().getBox().getId());
        x = placement.getAbsoluteX();
        y = placement.getAbsoluteY();
        z = placement.getAbsoluteZ();
        width = placement.getStackValue().getDx();
        length = placement.getStackValue().getDy();
        height = placement.getStackValue().getDz();
        surfaces = new ArrayList<>();
        for (com.github.skjolber.packing.api.Surface surface : placement.getStackValue().getSurfaces()) {
            surfaces.add(new Surface(surface));
        }
    }

//    public Placement toPlacement() {
//        List<com.github.skjolber.packing.api.Surface> packingSurfaces = new ArrayList<>();
//        for (Surface surface : surfaces) {
//            packingSurfaces.add(new com.github.skjolber.packing.api.Surface(surface.label, surface.attributes));
//        }
//
//        return new Placement(new BoxStackValue(width, length, height, packingSurfaces, productId), new Default3DPlanePoint3D())
//    }
}
