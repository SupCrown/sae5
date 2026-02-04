package com.aramis.models.support; // Adapte si tu es dans com.aramis.repositories

import com.aramis.models.support.Support; // ATTENTION : Utilise le package de TA classe Support
import com.aramis.models.user.User;       // ATTENTION : Utilise le package de TA classe User
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SupportRepository extends JpaRepository<Support, Long> {
    // Cette méthode manquait et causait l'erreur "cannot find symbol"
    Optional<Support> findByPreparedByAndStatus(User preparedBy, String status);
}