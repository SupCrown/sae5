package com.aramis.models.product;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProductRepository extends CrudRepository<Product, Integer> {
    @Query("SELECT p FROM Contain c JOIN Product p ON c.ProductID = p.ProductID WHERE c.SupportID = ?1 order by p.ProductID")
    List<Product> findProductsBySupportID(Integer supportID);
}
