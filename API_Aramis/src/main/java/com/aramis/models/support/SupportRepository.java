package com.aramis.models.support; // Adapte si tu es dans com.aramis.repositories

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface SupportRepository extends CrudRepository<Support, Integer> {
    @Query("SELECT s FROM Support s WHERE s.OrderID = ?1")
    List<Support> findSupportsByOrderId(Integer orderID);

    Optional<Support> findByPreparedByAndStatus(User preparedBy, String status);
}
