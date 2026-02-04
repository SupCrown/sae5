package com.aramis.models.contain;

import com.aramis.models.contain.Contain; // Ton package réel
import com.aramis.models.support.Support; // Ton package réel
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContainRepository extends JpaRepository<Contain, Long> {
    // Cette méthode manquait
    List<Contain> findBySupport(Support support);
}