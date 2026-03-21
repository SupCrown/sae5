package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.dto.*;
import com.aramis.models.contain.Contain;
import com.aramis.models.contain.ContainRepository;
import com.aramis.models.customer.Customer;
import com.aramis.models.customer.CustomerRepository;
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
import com.aramis.services.PickingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderRepository orderRepository;
    private final SupportRepository supportRepository;
    private final ProductRepository productRepository;
    private final ContainRepository containRepository;
    private final SupportTypeRepository supportTypeRepository;
    private final PickingService pickingService;
    private final CustomerRepository customerRepository;


    public OrderController(OrderRepository orderRepository, SupportRepository supportRepository, ProductRepository productRepository, ContainRepository containRepository, SupportTypeRepository supportTypeRepository, PickingService pickingService, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.supportRepository = supportRepository;
        this.productRepository = productRepository;
        this.containRepository = containRepository;
        this.supportTypeRepository = supportTypeRepository;
        this.pickingService = pickingService;
        this.customerRepository = customerRepository;
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
    @GetMapping("/{id}")
    public ResponseEntity<Object> getOrderById(@PathVariable Integer id) {
        Optional<Order> order = orderRepository.findById(id);

        if (order.isPresent()) {
            List<SupportResponse> supportsResponses = getSupportResponses(order.get());
            return ResponseEntity.ok(new OrderResponse(order.get(), supportsResponses));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getOrders(@PageableDefault(size = 20) Pageable pageable) {
        var orders = orderRepository.findAll(pageable);

        List<OrderResponse> orderResponseList = new ArrayList<>();
        for (Order order : orders) {
            orderResponseList.add(new OrderResponse(order, getSupportResponses(order)));
        }
        return ResponseEntity.ok(orderResponseList);
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/create")
    public ResponseEntity<Order> createForm() {
        Order order = new Order();
        order.setPriority(false);
        return ResponseEntity.ok(order);
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/create")
    public ResponseEntity<OrderResponse> create(@RequestBody OrderRequest request) {
        Optional<Customer> customerOpt = customerRepository.findById(request.getCustomerId());
        if (customerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        Order order = new Order();
        order.setOrderDate(request.getOrderDate());
        order.setStatus(request.getStatus());
        order.setCustomer(customerOpt.get());
        order.setPriority(request.isPriority());
        order.setDateCreation(now);
        order.setDateModification(now);

        Order saved = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(new OrderResponse(saved, null));
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/update/{id}")
    public ResponseEntity<Order> getForUpdate(@PathVariable Integer id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/update/{id}")
    public ResponseEntity<Order> update(@PathVariable Integer id, @RequestBody OrderRequest request) {
        Optional<Order> existingOpt = orderRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Customer> customerOpt = customerRepository.findById(request.getCustomerId());
        if (customerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Order existing = existingOpt.get();
        existing.setOrderDate(request.getOrderDate());
        existing.setStatus(request.getStatus());
        existing.setCustomer(customerOpt.get());
        existing.setPriority(request.isPriority());
        existing.setDateModification(new Timestamp(System.currentTimeMillis()));

        Order saved = orderRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/import")
    public ResponseEntity<List<Order>> importCsv(@RequestParam("file") MultipartFile file) {
        List<Order> imported = new ArrayList<>();
        Timestamp now = new Timestamp(System.currentTimeMillis());

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                if (trimmed.isEmpty()) {
                    continue;
                }

                String[] parts = trimmed.split(";");
                if (parts.length < 3) {
                    parts = trimmed.split(",");
                }
                if (parts.length < 3) {
                    continue;
                }

                Integer customerId;
                try {
                    customerId = Integer.parseInt(parts[0].trim());
                } catch (NumberFormatException e) {
                    continue;
                }

                Optional<Customer> customerOpt = customerRepository.findById(customerId);
                if (customerOpt.isEmpty()) {
                    continue;
                }

                String statusName = parts[1].trim();
                String priorityValue = parts[2].trim();

                boolean priority = "1".equals(priorityValue) || "true".equalsIgnoreCase(priorityValue);

                Order order = new Order();
                order.setCustomer(customerOpt.get());
                order.setOrderDate(new java.sql.Date(now.getTime()));
                order.setStatus(com.aramis.utils.EPrepareStatus.valueOf(statusName));
                order.setPriority(priority);
                order.setDateCreation(now);
                order.setDateModification(now);

                imported.add(orderRepository.save(order));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(imported);
    }

    @Authorize(roles = Role.USER)
    @GetMapping("testPlacement/{id}")
    public ResponseEntity<List<List<ProductPlacement>>> testPlacement(@PathVariable Integer id) throws JsonProcessingException {
        List<Support> supports = supportRepository.findSupportsByOrderId(id);

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

    /**
     * Get all supports and product for an order.
     * @param order order to get supports and products
     * @return a list of all supports the order is made of
     */
    private List<SupportResponse> getSupportResponses(Order order) {
        Iterable<Support> supports = supportRepository.findAllByOrder(order);

         List<SupportResponse> supportsResponses = new ArrayList<>();
        for (Support support : supports) {
            Iterable<ProductSupportFormBD> products = productRepository.findAllProductBySupportID(support.getSupportID());

            List<ProductSupportResponse> productsResponses = new ArrayList<>();
            for (ProductSupportFormBD product : products) {
                productsResponses.add(new ProductSupportResponse(product.toProduct(), product.getSupportQuantity()));
            }

            supportsResponses.add(new SupportResponse(support, productsResponses));
        }
        return supportsResponses;
    }
}