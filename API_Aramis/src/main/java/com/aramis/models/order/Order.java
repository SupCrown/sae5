package com.aramis.models.order;

import jakarta.persistence.*;
import java.util.List;
import com.aramis.models.product.*; // Ou ton import correct pour Product
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "_order") // "_order" est souvent utilisé car "ORDER" est un mot clé SQL réservé
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    // C'EST CE CHAMP QUI MANQUAIT ET QUI FAISAIT PLANTER
    private int status;

    // Relation vers les produits (si tu l'as déjà)
    // @OneToMany... ou @ManyToMany...
    // private List<Product> products;

    public Order() {
    }

    // --- GETTERS ET SETTERS ---

    // Ajoute les getters/setters pour les produits si tu as ajouté la liste
}