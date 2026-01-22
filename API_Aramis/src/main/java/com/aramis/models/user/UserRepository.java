package com.aramis.models.user;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    @Query("SELECT u FROM _user u WHERE u.Login = ?1")
    User findByLogin(Integer login);

    Iterable<User> findAll(Pageable pageable);
}
