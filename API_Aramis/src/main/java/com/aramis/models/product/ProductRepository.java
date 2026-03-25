package com.aramis.models.product;

import com.aramis.dto.ProductSupportFormBD;
import com.aramis.models.location.Location;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends CrudRepository<Product, Integer> {
    @Query("SELECT p FROM Contain c JOIN Product p ON c.product.productID = p.productID WHERE c.support.supportID = ?1 order by p.productID")
    List<Product> findProductsBySupportID(Integer supportID);

    Iterable<Product> findAll(Pageable pageable);

    Optional<Product> findByLocation(Location location);

    @Query("SELECT new com.aramis.dto.ProductSupportFormBD(p, c.approvedQuantity) FROM Product p JOIN Contain c ON p.productID = c.product.productID WHERE c.support.supportID = ?1")
    Iterable<ProductSupportFormBD> findAllProductBySupportID(Integer id);

    Optional<Product> findByProductCode(int productCode);
}
