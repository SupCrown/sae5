package com.aramis.controllers;

import com.aramis.dto.OrderRequest;
import com.aramis.models.customer.Customer;
import com.aramis.models.customer.CustomerRepository;
import com.aramis.models.order.Order;
import com.aramis.models.order.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order")
public class OrderCrudController {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public OrderCrudController(OrderRepository orderRepository, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/create")
    public ResponseEntity<Order> createForm() {
        Order order = new Order();
        order.setPriority(false);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/create")
    public ResponseEntity<Order> create(@RequestBody OrderRequest request) {
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
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/update/{id}")
    public ResponseEntity<Order> getForUpdate(@PathVariable Integer id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

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

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Integer id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

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
}

