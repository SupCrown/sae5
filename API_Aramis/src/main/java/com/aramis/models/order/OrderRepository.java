package com.aramis.models.order;

import com.aramis.models.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface OrderRepository extends CrudRepository<Order, Integer> {
    Iterable<Order> findAll(Pageable pageable);

    @Query("SELECT o FROM _order o ORDER BY o.DateCreation ASC")
    List<Order> findAllByOrderByDateCreationAsc();

    List<Order> findAllPriority();

    @Query("SELECT o FROM _order o JOIN Support s ON o.OrderID == s.OrderID WHERE s.UserID IS NOT NULL")
    Order findByUserId(Integer userID);
}
