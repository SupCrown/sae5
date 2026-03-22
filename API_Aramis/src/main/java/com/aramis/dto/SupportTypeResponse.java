package com.aramis.dto;

import com.aramis.models.supportType.SupportType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupportTypeResponse {
    private Integer typeID;
    private String label;
    private Integer innerWidth;
    private Integer innerLength;
    private Integer innerHeight;

    public SupportTypeResponse(SupportType type) {
        typeID = type.getTypeID();
        label = type.getLabel();
        innerWidth = type.getInnerWidth();
        innerLength = type.getInnerLength();
        innerHeight = type.getInnerHeight();
    }
}
