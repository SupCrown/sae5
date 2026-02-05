package com.aramis.models.order;

import com.aramis.models.order.Order; // Ton package réel
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Cette méthode manquait
    List<Order> findByStatus(int status);
}