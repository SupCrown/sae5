package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.common.JwtUtils;
import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.dto.OrderResponse;
import com.aramis.models.order.Order;
import com.aramis.models.order.OrderRepository;
import com.aramis.utils.Role;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.aramis.services.AuthService.getUserID;

@Slf4j
@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderRepository orderRepository;
    private final HttpServletRequest request;
    private final AppConfigurationProperties properties;

    public OrderController(OrderRepository orderRepository, HttpServletRequest request, AppConfigurationProperties properties) {
        this.orderRepository = orderRepository;
        this.request = request;
        this.properties = properties;
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getUsers(@PageableDefault(size = 20) Pageable pageable) {
        var orders = orderRepository.findAll(pageable);

        List<OrderResponse> orderResponseList = new ArrayList<>();
        for (Order order : orders) {
            orderResponseList.add(new OrderResponse(order));
        }
        return ResponseEntity.ok(orderResponseList);
    }
    @Authorize(roles = Role.USER)
    @GetMapping("autoAssign")
    public ResponseEntity<Object> autoAssign() {
        Integer userID = getUserID(request, properties);

        List<Order> orders = orderRepository.findAllByOrderByDateCreationAsc();

        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }



        return ResponseEntity.ok(orders);
    }
}
