package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.dto.CreateUserRequest;
import com.aramis.dto.OrderResponse;
import com.aramis.dto.UserResponse;
import com.aramis.models.order.Order;
import com.aramis.models.order.OrderRepository;
import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import com.aramis.utils.Role;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getUsers(@PageableDefault(size = 20) Pageable pageable) {
        var orders = orderRepository.findAll(pageable);

        List<OrderResponse> orderResponseList = new ArrayList<>();
        for (Order order : orders) {
            orderResponseList.add(new OrderResponse(order));
        }
        return ResponseEntity.status(200).body(orderResponseList);
    }
}
