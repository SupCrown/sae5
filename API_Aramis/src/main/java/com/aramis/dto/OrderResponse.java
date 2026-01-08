package com.aramis.dto;

import com.aramis.models.order.EOrderStatus;
import com.aramis.models.order.Order;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.sql.Date;

public class OrderResponse {
    public int OrderID;
    public Date OrderDate;
    public EOrderStatus Status;
    public int CustomerID;

    public OrderResponse(Order order) {
        this.OrderID = order.getOrderID();
        this.OrderDate = order.getOrderDate();
        this.Status = order.getStatus();
        this.CustomerID = order.getCustomerID();
    }
}
