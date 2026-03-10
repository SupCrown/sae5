package com.aramis.models.support; // Adapte si tu es dans com.aramis.repositories

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import com.aramis.models.order.Order;
import com.aramis.models.user.User;
import java.util.Optional;

public interface SupportRepository extends CrudRepository<Support, Integer> {
    @Query("SELECT s FROM Support s WHERE s.OrderID = ?1")
    List<Support> findSupportsByOrderId(Integer orderID);

    Optional<Support> findByPreparedByAndStatus(User preparedBy, String status);

    // Récupère le dernier support associé à une commande donnée
    Optional<Support> findFirstByOrderOrderBySupportIdDesc(Order order);
}