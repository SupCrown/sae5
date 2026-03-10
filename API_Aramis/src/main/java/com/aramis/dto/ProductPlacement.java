package com.aramis.dto;

import com.aramis.models.supportType.SupportType;
import com.github.skjolber.packing.api.BoxStackValue;
import com.github.skjolber.packing.api.Placement;
import com.github.skjolber.packing.ep.points3d.Default3DPlanePoint3D;
import com.github.skjolber.packing.ep.points3d.DefaultPoint3D;
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
    int dx;
    int dy;
    int dz;
    List<Surface> surfaces;

    public ProductPlacement(Placement placement, SupportType supportType) {
        productId = Integer.parseInt(placement.getBoxItem().getBox().getId());
        x = placement.getAbsoluteX();
        y = placement.getAbsoluteY();
        z = placement.getAbsoluteZ();
        dx = placement.getStackValue().getDx();
        dy = placement.getStackValue().getDy();
        dz = placement.getStackValue().getDz();
        surfaces = new ArrayList<>();
        for (com.github.skjolber.packing.api.Surface surface : placement.getStackValue().getSurfaces()) {
            surfaces.add(new Surface(surface));
        }
    }
}
