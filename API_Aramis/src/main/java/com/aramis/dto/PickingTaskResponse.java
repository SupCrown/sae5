package com.aramis.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PickingTaskResponse {
    private String type; // "NEW_SUPPORT", "PICK_PRODUCT", "FINISHED", "NO_ORDERS"

    private Long supportId;
    private Long productId;

    private int targetX;
    private int targetY;
    private int targetZ;
}