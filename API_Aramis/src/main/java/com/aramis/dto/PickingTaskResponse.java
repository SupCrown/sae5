package com.aramis.dto;

import com.aramis.utils.PickingTaskResponseType;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PickingTaskResponse {
    private PickingTaskResponseType type;

    private ProductPlacement step;
    private Integer placedQuantity;
    private Integer quantityToPlace;
    private Integer orderID;
    private String location;
}