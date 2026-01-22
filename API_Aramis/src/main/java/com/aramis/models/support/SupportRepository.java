package com.aramis.models.support;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface SupportRepository extends CrudRepository<Support, Integer> {
    @Query("SELECT s FROM Support s WHERE s.OrderID = ?1")
    List<Support> findSupportsByOrderId(int orderID);
}
