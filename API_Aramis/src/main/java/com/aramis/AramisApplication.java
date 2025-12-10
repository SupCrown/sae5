package com.aramis;// Adaptez à votre package

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class AramisApplication {

    public static void main(String[] args) {
        SpringApplication.run(AramisApplication.class, args);
    }

    // --- TESTeur de connexion (à retirer plus tard) ---
    // Ce code s'exécute automatiquement au lancement de l'appli
    @Bean
    public CommandLineRunner testConnection(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection()) {
                System.out.println("----------------------------------------------");
                System.out.println("SUCCES : Connexion valide à la BDD 'aramis' !");
                System.out.println("URL : " + conn.getMetaData().getURL());
                System.out.println("----------------------------------------------");
            } catch (Exception e) {
                System.err.println("ERREUR : Impossible de se connecter à Hostinger.");
                e.printStackTrace();
            }
        };
    }
}