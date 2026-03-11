package com.aramis.models.order;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface OrderRepository extends CrudRepository<Order, Integer> {
    Iterable<Order> findAll(Pageable pageable);

    // Cette méthode manquait
    List<Order> findByStatus(int status);

    List<Order> findByStatusOrderByPriorityDesc(int status);
}