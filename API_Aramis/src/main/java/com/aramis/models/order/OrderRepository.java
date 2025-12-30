package com.aramis.models.order;

import com.aramis.models.user.User;
import org.springframework.data.repository.CrudRepository;

public interface OrderRepository extends CrudRepository<Order, Integer> {
}
