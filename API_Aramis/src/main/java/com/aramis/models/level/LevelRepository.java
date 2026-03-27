package com.aramis.models.level;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface LevelRepository extends CrudRepository<Level, Integer> {
    Iterable<Level> findAll(Pageable pageable);
}
