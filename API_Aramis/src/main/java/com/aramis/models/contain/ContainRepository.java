package com.aramis.models.contain;

import com.aramis.models.product.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ContainRepository extends CrudRepository<Contain, ContainCompositeKey> {
}
