package com.aramis.dto;

import com.aramis.models.customer.Customer;
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
public class CustomerResponse {
    private Integer customerID;
    private String name;
    private Integer code;

    public CustomerResponse(Customer customer) {
        customerID = customer.getCustomerID();
        name = customer.getName();
        code = customer.getCode();
    }
}
