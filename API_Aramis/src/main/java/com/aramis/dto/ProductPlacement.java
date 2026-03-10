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
    int minX;
    int minY;
    int minZ;
    int maxX;
    int maxY;
    int maxZ;
    int supportWidth;
    int supportLength;
    int supportHeight;

    public ProductPlacement(Placement placement, SupportType supportType) {
        productId = Integer.parseInt(placement.getBoxItem().getBox().getId());
        x = placement.getAbsoluteX();
        y = placement.getAbsoluteY();
        z = placement.getAbsoluteZ();
        dx = placement.getStackValue().getDx();
        dy = placement.getStackValue().getDy();
        dz = placement.getStackValue().getDz();
        minX = placement.getPoint().getMinX();
        minY = placement.getPoint().getMinY();
        minZ = placement.getPoint().getMinZ();
        maxX = placement.getPoint().getMaxX();
        maxY = placement.getPoint().getMaxY();
        maxZ = placement.getPoint().getMaxZ();
        surfaces = new ArrayList<>();
        for (com.github.skjolber.packing.api.Surface surface : placement.getStackValue().getSurfaces()) {
            surfaces.add(new Surface(surface));
        }
        supportWidth = supportType.getInnerWidth();
        supportHeight = supportType.getInnerLength();
        supportLength = supportType.getInnerHeight();
    }

    public Placement toPlacement() {
        List<com.github.skjolber.packing.api.Surface> packingSurfaces = new ArrayList<>();
        for (Surface surface : surfaces) {
            packingSurfaces.add(new com.github.skjolber.packing.api.Surface(surface.label, surface.attributes));
        }

        var planePoint = new DefaultPoint3D(0, 0, 0, supportWidth-1, supportLength-1, supportHeight-1);
        var planBoxStackValue = new BoxStackValue(planePoint.getDx(), planePoint.getDy(), planePoint.getDx(), null, -1);
        var plane = new Placement(planBoxStackValue, planePoint);

        return new Placement(new BoxStackValue(dx, dy, dz, packingSurfaces, 0), new Default3DPlanePoint3D(minX, minY, minZ, maxX, maxY, maxZ, plane, plane, plane));
    }
}
