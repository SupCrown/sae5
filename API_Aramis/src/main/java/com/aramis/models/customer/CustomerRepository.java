package com.aramis.models.customer;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRepository extends CrudRepository<Customer, Integer> {
    Iterable<Customer> findAll(Pageable pageable);
}
