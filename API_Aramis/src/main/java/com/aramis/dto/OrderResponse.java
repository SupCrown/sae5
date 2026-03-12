package com.aramis.dto;

import com.aramis.utils.EPrepareStatus;
import com.aramis.models.order.Order;

import java.sql.Date;

public class OrderResponse {
    public int OrderID;
    public Date OrderDate;
    public EPrepareStatus Status;
    public int CustomerID;

    public OrderResponse(Order order) {
        this.OrderID = order.getOrderID();
        this.OrderDate = order.getOrderDate();
        this.Status = order.getStatus();
        this.CustomerID = order.getCustomer().getCustomerID();
    }
}
