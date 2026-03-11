package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.dto.OrderResponse;
import com.aramis.dto.ProductPlacement;
import com.aramis.models.contain.Contain;
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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import com.aramis.dto.PickingTaskResponse;
import com.aramis.services.PickingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
    private final PickingService pickingService;

    public OrderController(OrderRepository orderRepository, SupportRepository supportRepository, ProductRepository productRepository, HttpServletRequest request, AppConfigurationProperties properties, ContainRepository containRepository, SupportTypeRepository supportTypeRepository, PickingService pickingService) {
        this.orderRepository = orderRepository;
        this.supportRepository = supportRepository;
        this.productRepository = productRepository;
        this.request = request;
        this.properties = properties;
        this.containRepository = containRepository;
        this.supportTypeRepository = supportTypeRepository;
        this.pickingService = pickingService;
    }

    // Endpoint 1 : Attribution Automatique
    @Authorize(roles = Role.USER)
    @PostMapping("/autoAssign")
    public ResponseEntity<PickingTaskResponse> autoAssign(
            @RequestParam(name = "PreparateurID") int preparateurId
    ) {
        PickingTaskResponse task = pickingService.getNextTask(preparateurId);
        return ResponseEntity.ok(task);
    }

    // Endpoint 2 : Attribution Manuelle
    @Authorize(roles = Role.ADMIN)
    @PostMapping("/manualAssign")
    public ResponseEntity<PickingTaskResponse> manualAssign(
            @RequestParam(name = "PreparateurID") int preparateurId,
            @RequestParam(name = "CommandeID") int orderId) {

        PickingTaskResponse task = pickingService.assignOrderManually(preparateurId, orderId);
        return ResponseEntity.ok(task);
    }

    // Endpoint 3 : Étape suivante de la commande
    @Authorize(roles = Role.USER)
    @PostMapping("/nextStep")
    public ResponseEntity<java.util.List<java.util.List<java.util.List<Integer>>>> nextStep(
            @RequestParam(name = "CommandeID") int orderId
    ) {
        var nextStep = pickingService.getNextStep(orderId);
        return ResponseEntity.ok(nextStep);
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
    @GetMapping("testPlacement")
    public ResponseEntity<List<List<ProductPlacement>>> testPlacement() throws JsonProcessingException {
        List<Support> supports = supportRepository.findSupportsByOrderId(1);

        List<List<ProductPlacement>> productsPlacements = new ArrayList<>();
        for (Support support : supports) {
            List<Contain> contains = containRepository.findAllBySupportId(support.getSupportID());
            List<Product> products = SupportService.calculSupport(productRepository.findProductsBySupportID(support.getSupportID()), contains);

            var type = supportTypeRepository.findById(support.getType().getTypeID());
            if (type.isPresent()) {
                List<ProductPlacement> productPlacements = SupportService.calculateOptimisedSupport(products, type.get());

                ObjectMapper objectMapper = new ObjectMapper();
                support.setNestedProductsPlacements(objectMapper.writeValueAsString(productPlacements));
                supportRepository.save(support);
                productsPlacements.add(productPlacements);
            } else {
                throw new RuntimeException("Type not found");
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(productsPlacements);
    }
}