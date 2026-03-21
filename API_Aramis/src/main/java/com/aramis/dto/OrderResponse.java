package com.aramis.dto;

import com.aramis.models.support.Support;
import com.aramis.utils.EPrepareStatus;
import com.aramis.models.order.Order;

import java.sql.Date;
import java.util.List;

public class OrderResponse {
    public int orderID;
    public Date orderDate;
    public EPrepareStatus status;
    public int customerID;
    public List<SupportResponse> supports;

    public OrderResponse(Order order, List<SupportResponse> supports) {
        this.orderID = order.getOrderID();
        this.orderDate = order.getOrderDate();
        this.status = order.getStatus();
        this.customerID = order.getCustomer().getCustomerID();
        this.supports = supports;
    }
}
