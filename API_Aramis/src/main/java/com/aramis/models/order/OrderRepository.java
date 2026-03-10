package com.aramis.models.order;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// CORRECTION : On passe de Integer à Long pour correspondre à l'entité
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatusOrderByPriorityDesc(int status);
}