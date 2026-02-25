package com.aramis.dto;

import com.github.skjolber.packing.api.Placement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductPlacement {
    Integer ProductId;
    Integer X;
    Integer Y;
    Integer Z;
    Integer Width;
    Integer Length;
    Integer Height;

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
