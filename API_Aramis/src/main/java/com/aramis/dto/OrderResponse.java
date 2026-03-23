package com.aramis.dto;

import com.aramis.models.support.Support;
import com.aramis.utils.EPrepareStatus;
import com.aramis.models.order.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private int orderID;
    private Date orderDate;
    private boolean priority;
    private EPrepareStatus status;
    private int customerID;
    private List<SupportResponse> supports;

    public OrderResponse(Order order, List<SupportResponse> supports) {
        this.orderID = order.getOrderID();
        this.orderDate = order.getOrderDate();
        this.status = order.getStatus();
        this.customerID = order.getCustomer().getCustomerID();
        this.supports = supports;
        this.priority = order.isPriority();
    }
}
