package com.aramis.dto;

import com.aramis.models.customer.Customer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRequest {
    @NotBlank
    private String name;
    @NotNull
    private Integer code;

    public Customer toCustomer() {
        Timestamp now = new Timestamp(System.currentTimeMillis());

        Customer customer = new Customer();
        customer.setCode(code);
        customer.setName(name);
        customer.setDateCreation(now);
        customer.setDateModification(now);

        return customer;
    }
}
