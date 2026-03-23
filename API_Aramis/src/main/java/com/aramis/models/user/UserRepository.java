package com.aramis.models.user;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {
    @Query("SELECT u FROM _user u WHERE u.login = ?1")
    Optional<User> findByLogin(Integer login);

    Iterable<User> findAll(Pageable pageable);

    @Query("SELECT u FROM _user u WHERE NOT u.isAdmin")
    Iterable<User> findAllNotAdmin();
}
