package com.aramis.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlacementData {
    private String productId;
    private int x;
    private int y;
    private int z;

    // Constructeur vide nécessaire pour Jackson (le lecteur JSON)
    public PlacementData() {}
}