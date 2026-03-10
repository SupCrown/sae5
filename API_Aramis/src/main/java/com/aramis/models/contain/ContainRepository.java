package com.aramis.models.contain;

import com.aramis.models.product.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ContainRepository extends CrudRepository<Contain, ContainCompositeKey> {
    @Query("SELECT c.ProductID FROM Contain c where c.SupportID = ?1 and not c.MissingItems and c.ServedQuantity = c.ApprovedQuantity")
    List<Integer> findAllPlacedProductIdsBySupportId(Integer supportID);

    @Query("SELECT c.ProductID FROM Contain c where c.SupportID = ?1 and c.MissingItems")
    List<Integer> findAllMissingProductIdsBySupportId(Integer supportID);

    @Query("SELECT c FROM Contain c where c.SupportID = ?1")
    List<Contain> findAllBySupportId(Integer supportID);

    List<Contain> findBySupport(Support support);
}
