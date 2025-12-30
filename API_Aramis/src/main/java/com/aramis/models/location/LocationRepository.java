package com.aramis.models.location;

import com.aramis.models.user.User;
import org.springframework.data.repository.CrudRepository;

public interface LocationRepository extends CrudRepository<Location, Integer> {
}
