package com.aramis.models.contain;

import com.aramis.models.product.Product;
import com.aramis.models.support.Support;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ContainRepository extends CrudRepository<Contain, Integer> {
    @Query("SELECT c.product.productID FROM Contain c where c.support.supportID = ?1 and not c.missingItems and c.servedQuantity = c.approvedQuantity")
    List<Integer> findAllPlacedProductIdsBySupportId(Integer supportID);

    @Query("SELECT c.product.productID FROM Contain c where c.support.supportID = ?1 and c.missingItems")
    List<Integer> findAllMissingProductIdsBySupportId(Integer supportID);

    @Query("SELECT c FROM Contain c where c.support.supportID = ?1")
    List<Contain> findAllBySupportId(Integer supportID);

    List<Contain> findBySupport(Support support);

    @Query("SELECT sum(COALESCE(c.servedQuantity, 0)) FROM Contain c where c.support.supportID in ?1")
    Integer findPlacedProductNumberSumBySupportsIDs(List<Integer> supportIDs);

    Optional<Contain> findBySupportAndProductProductID(Support support, int productID);
}
