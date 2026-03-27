package com.aramis.models.zone;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface ZoneRepository extends CrudRepository<Zone, Integer> {
    Iterable<Zone> findAll(Pageable pageable);
}
