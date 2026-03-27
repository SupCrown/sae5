package com.aramis.models.driveway;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface DrivewayRepository extends CrudRepository<Driveway, Integer> {
    Iterable<Driveway> findAll(Pageable pageable);
}
