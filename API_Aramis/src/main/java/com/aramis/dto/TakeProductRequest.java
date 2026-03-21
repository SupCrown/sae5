package com.aramis.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TakeProductRequest {
    @NotNull
    private Integer productID;
    @NotNull
    private Integer quantityToTake;
}
