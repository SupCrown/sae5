package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.common.JwtUtils;
import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.dto.OrderResponse;
import com.aramis.models.contain.ContainRepository;
import com.aramis.models.order.Order;
import com.aramis.models.order.OrderRepository;
import com.aramis.models.product.Product;
import com.aramis.models.product.ProductRepository;
import com.aramis.models.support.Support;
import com.aramis.models.support.SupportRepository;
import com.aramis.models.supportType.SupportTypeRepository;
import com.aramis.services.SupportService;
import com.aramis.utils.Role;
import com.github.skjolber.packing.api.Placement;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import static com.aramis.services.AuthService.getUserID;

@Slf4j
@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderRepository orderRepository;
    private final SupportRepository supportRepository;
    private final ProductRepository productRepository;
    private final HttpServletRequest request;
    private final AppConfigurationProperties properties;
    private final ContainRepository containRepository;
    private final SupportTypeRepository supportTypeRepository;

    public OrderController(OrderRepository orderRepository, SupportRepository supportRepository, ProductRepository productRepository, HttpServletRequest request, AppConfigurationProperties properties, ContainRepository containRepository, SupportTypeRepository supportTypeRepository) {
        this.orderRepository = orderRepository;
        this.supportRepository = supportRepository;
        this.productRepository = productRepository;
        this.request = request;
        this.properties = properties;
        this.containRepository = containRepository;
        this.supportTypeRepository = supportTypeRepository;
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
    public ResponseEntity<List<List<Placement>>> autoAssign() {
        Integer userID = getUserID(request, properties);

        Order order = orderRepository.findByUserId(userID);
        if (order == null) {
            List<Order> priorityOrders = orderRepository.findAllPriority();

            List<Order> orders = null;
            if (priorityOrders.isEmpty()) {
                orders = orderRepository.findAllByOrderByDateCreationAsc();
                if (orders.isEmpty()) {
                    return ResponseEntity.noContent().build();
                }
            }

            List<Order> sortedOrders = null;
            if (!priorityOrders.isEmpty()) {
                sortedOrders = priorityOrders.stream().sorted(Comparator.comparing(Order::getPriorityModificationDate)).toList();
            } else {
                sortedOrders = orders.stream().sorted(Comparator.comparing(Order::getOrderDate)).toList();
            }

            order = sortedOrders.get(0);
        }

        List<Support> supports = supportRepository.findSupportsByOrderId(order.getOrderID());

        List<List<Placement>> productsPlacements = new ArrayList<>();
        for (Support support : supports) {
            List<Product> products = productRepository.findProductsBySupportID(support.getSupportID());
            var type = supportTypeRepository.findById(support.TypeID);

            if (type.isPresent()) {
                productsPlacements.add(SupportService.calculateOptimisedSupport(products, type.get()));
            } else {
                throw new RuntimeException("Type not found");
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(productsPlacements);
    }
}