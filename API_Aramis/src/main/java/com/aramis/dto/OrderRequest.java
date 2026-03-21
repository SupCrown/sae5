package com.aramis.dto;

import com.aramis.utils.EPrepareStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Date orderDate;
    private EPrepareStatus status;
    private Integer customerId;
    private boolean priority;
}

