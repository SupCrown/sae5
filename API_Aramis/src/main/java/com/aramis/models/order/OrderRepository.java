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

    @Query("SELECT o FROm _order o WHERE o.IsAPriority")
    List<Order> findAllPriority();

    @Query("SELECT o FROM _order o JOIN Support s ON o.OrderID = s.OrderID WHERE s.UserID = ?1 AND o.OrderID NOT IN (SELECT o2.OrderID FROM _order o2 JOIN Support s2 ON o2.OrderID = s2.OrderID JOIN Contain c ON s2.SupportID = c.SupportID WHERE c.ApprovedQuantity = c.ServedQuantity OR c.MissingItems) ORDER BY o.DateCreation ASC")
    Order findUncompletedOrderByUserId(Integer userID);
}
