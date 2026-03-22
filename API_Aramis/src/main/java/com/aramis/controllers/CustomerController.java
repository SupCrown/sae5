package com.aramis.controllers;

import com.aramis.dto.CustomerRequest;
import com.aramis.dto.CustomerResponse;
import com.aramis.dto.DrivewayResponse;
import com.aramis.models.customer.Customer;
import com.aramis.models.customer.CustomerRepository;
import com.aramis.models.driveway.Driveway;
import com.aramis.models.driveway.DrivewayRepository;
import jakarta.validation.Valid;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
@Slf4j
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable Integer id) {
        Optional<Customer> customer = customerRepository.findById(id);
        return customer.map(value -> ResponseEntity.ok(new CustomerResponse(value))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<Iterable<CustomerResponse>> getAll(@PageableDefault(size = 20, sort = "customerID") Pageable pageable) {
        var customers = customerRepository.findAll(pageable);

        List<CustomerResponse> customersResponses = new ArrayList<>();
        for(Customer customer : customers) {
            customersResponses.add(new CustomerResponse(customer));
        }

        return ResponseEntity.ok(customersResponses);
    }

    @GetMapping("/create")
    public ResponseEntity<Object> getAll(@Valid @RequestBody CustomerRequest request) {
        try {
            Customer customer = request.toCustomer();

            customer = customerRepository.save(customer);

            return ResponseEntity.ok(new CustomerResponse(customer));
        } catch (Exception e) {
            log.error("Error while creating customer", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable Integer id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            customerRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while deleting location", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }
    }
}

