package com.aramis.models.support; // Adapte si tu es dans com.aramis.repositories

import com.aramis.utils.EPrepareStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import com.aramis.models.order.Order;
import com.aramis.models.user.User;
import java.util.Optional;

public interface SupportRepository extends CrudRepository<Support, Integer> {
    @Query("SELECT s FROM Support s WHERE s.order.orderID = ?1")
    List<Support> findSupportsByOrderId(Integer orderID);

    Optional<Support> findByUserAndStatus(User user, EPrepareStatus status);

    // Récupère le dernier support associé à une commande donnée
    Optional<Support> findFirstByOrderOrderBySupportIDDesc(Order order);

    List<Support> findAllByUser(User user);
}