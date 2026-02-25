package com.aramis.dto;

import com.github.skjolber.packing.api.Placement;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductPlacement {
    int ProductId;
    int X;
    int Y;
    int Z;
    int Width;
    int Length;
    int Height;

    public ProductPlacement(Placement placement) {
        ProductId = Integer.parseInt(placement.getBoxItem().getBox().getId());
        X = placement.getAbsoluteX();
        Y = placement.getAbsoluteY();
        Z = placement.getAbsoluteZ();
        Width = placement.getStackValue().getDx();
        Length = placement.getStackValue().getDy();
        Height = placement.getStackValue().getDz();
    }
}
