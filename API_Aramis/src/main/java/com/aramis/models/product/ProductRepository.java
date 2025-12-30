package com.aramis.models.product;

import com.aramis.models.user.User;
import org.springframework.data.repository.CrudRepository;

public interface ProductRepository extends CrudRepository<Product, Integer> {
}
