package com.aramis.models.customer;

import com.aramis.models.user.User;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRepository extends CrudRepository<Customer, Integer> {
}
