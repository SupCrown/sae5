package com.aramis.dto;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PickingTaskResponse {
    private String type; // "NEW_SUPPORT", "PICK_PRODUCT", "FINISHED", "NO_ORDERS"

    private Integer supportId;
    private Integer productId;

    private int targetX;
    private int targetY;
    private int targetZ;
}