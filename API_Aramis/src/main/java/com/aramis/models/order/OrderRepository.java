package com.aramis.models.order;

import com.aramis.utils.EPrepareStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface OrderRepository extends CrudRepository<Order, Integer> {
    Iterable<Order> findAll(Pageable pageable);

    // Cette méthode manquait
    @Query("SELECT o FROM _order o WHERE o.Status = ?1")
    List<Order> findByStatus(EPrepareStatus status);

    @Query("SELECT o FROM _order o WHERE o.Status = ?1 ORDER BY o.priority DESC")
    List<Order> findByStatusOrderByPriorityDesc(EPrepareStatus status);
}