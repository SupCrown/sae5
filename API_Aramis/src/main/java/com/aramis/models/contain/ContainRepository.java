package com.aramis.models.contain;

import com.aramis.models.user.User;
import org.springframework.data.repository.CrudRepository;

public interface ContainRepository extends CrudRepository<Contain, ContainCompositeKey> {
}
