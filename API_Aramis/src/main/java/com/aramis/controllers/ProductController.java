package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.dto.*;
import com.aramis.models.location.Location;
import com.aramis.models.location.LocationRepository;
import com.aramis.models.product.Product;
import com.aramis.models.product.ProductRepository;
import com.aramis.models.user.User;
import com.aramis.utils.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sound.sampled.Port;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;

    public ProductController(ProductRepository productRepository, LocationRepository locationRepository) {
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductByID(@PathVariable Integer id) {
        Optional<Product> product = productRepository.findById(id);

        return product.map(value -> ResponseEntity.ok(new ProductResponse(value))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<List<ProductResponse>> getProducts(@PageableDefault(size = 20, sort = "productID") Pageable pageable) {
        var products = productRepository.findAll(pageable);

        List<ProductResponse> productResponseList = new ArrayList<>();
        for (Product product : products) {
            productResponseList.add(new ProductResponse(product));
        }

        productResponseList.sort(Comparator.comparingInt(ProductResponse::getProductID));

        return ResponseEntity.ok(productResponseList);
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/create")
    public ResponseEntity<Object> createProduct(@Valid @RequestBody CreateProductRequest request) {
        Optional<Location> location = locationRepository.findByCodeLevelDrivewayAndZone(request.getLocation(), request.getLevel(), request.getDriveway(), request.getZone());

        if (location.isPresent()) {
            Optional<Product> alreadyPlacedProduct = productRepository.findByLocation(location.get());
            if (alreadyPlacedProduct.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request : emplacement déjà utilisé.");
            }

            Product product = request.toProduct(location.get());
            try {
                productRepository.save(product);

                ProductResponse response = new ProductResponse(product);

                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(response);
            } catch (Exception e) {
                log.error("Error while creating product", e);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/add")
    public ResponseEntity<Object> addProduct(@Valid @RequestBody AddProductRequest request) {
        Optional<Product> product = productRepository.findById(request.getProductID());

        if (product.isPresent()) {
            Product updatedProduct = product.get();
            updatedProduct.setQuantity(updatedProduct.getQuantity() + request.getQuantityToAdd());

            try {
                productRepository.save(updatedProduct);
            } catch (Exception e) {
                log.error("Error while updating product", e);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
            }

            return ResponseEntity.status(200).body(new ProductResponse(updatedProduct));
        }
        else
        {
            return ResponseEntity.notFound().build();
        }
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/take")
    public ResponseEntity<Object> takeProduct(@Valid @RequestBody TakeProductRequest request) {
        Optional<Product> product = productRepository.findById(request.getProductID());

        if (product.isPresent()) {
            Product updatedProduct = product.get();
            int nextQuantity = updatedProduct.getQuantity() - request.getQuantityToTake();
            updatedProduct.setQuantity(Math.max(nextQuantity, 0));

            try {
                productRepository.save(updatedProduct);
            } catch (Exception e) {
                log.error("Error while updating product", e);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
            }

            return ResponseEntity.status(200).body(new ProductResponse(updatedProduct));
        }
        else
        {
            return ResponseEntity.notFound().build();
        }
    }

    @Authorize(roles = Role.ADMIN)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable Integer id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while deleting product", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }
    }
}
