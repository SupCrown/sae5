package com.aramis.models.supportType;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface SupportTypeRepository extends CrudRepository<SupportType, Integer> {
    Iterable<SupportType> findAll(Pageable pageable);
}
