package com.aramis.dto;

import com.aramis.models.customer.Customer;
import com.aramis.models.order.Order;
import com.aramis.utils.EPrepareStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderImportRequest {
    @NotNull
    private Date orderDate;
    @NotNull
    private Integer customerID;
    @NotNull
    private Integer typeID;
    private boolean priority;
    @NotNull
    private MultipartFile file;

    public Order toOrder(Customer customer) {
        Timestamp now = new Timestamp(System.currentTimeMillis());

        Order order = new Order();
        order.setOrderDate(orderDate);
        order.setStatus(EPrepareStatus.Pending);
        order.setCustomer(customer);
        order.setPriority(priority);
        order.setDateCreation(now);
        order.setDateModification(now);

        return order;
    }
}

