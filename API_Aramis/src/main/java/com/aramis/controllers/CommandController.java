package com.aramis.controllers;

import com.aramis.dto.CommandInput;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api") // Préfixe global pour les routes de ce contrôleur
@CrossOrigin(origins = "*") // Autorise le front à contacter le back
public class CommandController {

    @PostMapping("/process-text")
    public ResponseEntity<String> processText(@RequestBody CommandInput input) {
        // 1. Récupération du texte envoyé par le front
        String receivedText = input.getText();

        // 2. Log pour vérifier que ça marche (s'affichera dans votre console IntelliJ)
        System.out.println("----------------------------------------------");
        System.out.println("Texte reçu du front : " + receivedText);
        System.out.println("----------------------------------------------");

        // ICI, plus tard, nous appellerons votre logique de "Main.java"
        // pour décider de l'action (ex: packing) selon le texte.

        // 3. Réponse au front pour dire "J'ai bien reçu"
        return ResponseEntity.ok("j'ai reçu chakal" + receivedText);
    }
}