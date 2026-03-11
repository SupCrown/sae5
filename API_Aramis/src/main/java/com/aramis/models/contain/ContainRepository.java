package com.aramis.models.contain;

import com.aramis.models.support.Support;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ContainRepository extends CrudRepository<Contain, Integer> {
    @Query("SELECT c.product.productID FROM Contain c where c.support.supportID = ?1 and not c.missingItems and c.servedQuantity = c.approvedQuantity")
    List<Integer> findAllPlacedProductIdsBySupportId(Integer supportID);

    @Query("SELECT c.product.productID FROM Contain c where c.support.supportID = ?1 and c.missingItems")
    List<Integer> findAllMissingProductIdsBySupportId(Integer supportID);

    @Query("SELECT c FROM Contain c where c.support.supportID = ?1")
    List<Contain> findAllBySupportId(Integer supportID);

    List<Contain> findBySupport(Support support);
}
