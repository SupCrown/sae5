# Etude de cas Aramis

## Objectif Stratégique

- Assister les préparateurs de commande dans leur travail
- Gerer les stocks
- Gerer les emplacements
- Gerer les commandes
- Gerer les préparateurs

## Objectifs Utilisateur (Métier)

### Préparateurs

- Commencer une commande
- Récupérer une commande en cours au cas ou le Zebra plante
- Voir son support en 3 dimensions
- Connaitre l'emplacement du prochain colis
- S'identifier grâce à un code utilisateur à 3 chiffre
- Dicter les étapes à l'application
- Entendre l'étape en cours
- Suivre ses performance en temps réel

### Superviseurs

- Visualiser les statistiques des préparateurs
- CRUD préparateur
- CRUD emplacement
- CRUD commande 
- Entrer des stocks

## API

### Documentation API

Définir les endpoints avant de les développer pour permettre à l'equipe front de travailler sans se poser de questions.

### BDD

- MCD
- Création des tables

### API

- Authentification :
    - `/login` **[POST]**.: Récupérer le JWT d'authentification.
      - `login` : entier à trois chiffres (`000 - 999`)
      - Réponses :
        - `200` : Utilisateur connecté,
        - `401` : Aucune authentification détectée,
        - `403` : Accès refusé par manque de droits.
    - `/logout` **[POST]** : Supprimer le JWT d'authentification.
- `/order/id?[etape=xxx]` **[GET]**  : Chargement d'une commande en f° d'un id (et en f° ou non d'une étape précise).
    - trier les colis en fonction du sens de circulation **(I-008-0001 -> H-001-0144)**.
- Attribution des commandes :
    - `/order/autoAssign` **[POST]** : automatique (au chargement de l'application) en f° d'un PreparateurID.
        - **Si aucune commande en cours pour le préparateur** : chargement d'une commande en attente.
          - `200` : la commande est assignée,
          - `204` : aucune commande à assigner a été trouvée.
        - **Sinon** : récupération d'une commande en cours en cas de crash. 
          - `307` : la prépration de la commande n'avait pas été finalisée à la dernière fermeture de l'application.
    - `/order/manualAssign?CommandeID=xxx&PreparateurID=yyy` **[POST]** : manuelle.
- (Gestion de la dictée vocale)
- (Gestion de la commande vocal)
- `/order/nextStep?CommandeID=xxx` **[POST]** : Udapte d'une commande et renvoi de l'étape suivante sous la forme d'un tableau (étape) de tableau (objet) de deux tupples (position, dimension) de taille 3 pour `[[(x,y,z),(w,l,h)],[...], ...]`.
    - Si la **quantité validée == quantité servie** OU s'il y a ** au moins un colis manquant** sur la quantité validée.
- Calcul et envoi des statistiques pour superviseurs et préparateurs :
    - `/preparer/stats/id` **[GET]** : statistique du nombre de colis par heure pour un préparateur.
    - `/preparer/stats` **[GET]** : statistique générales de tous les préparateurs.
- CRUD préparateurs :
    - `/preparer/create` **[POST]** : **créer** un préparateur.
    - `/preparer/update/id` **[POST]** : **modifier** un préparateur.
    - `/preparer/delete/id` **[POST]** : **supprimer** un préparateur.
    - `/preparer/id` **[GET]** : **consulter** un préparateur.
- CRUD commandes :
    - `/order/create` **[POST]** : **créer** un commande.
    - `/order/update/id` **[POST]** : **modifier** un commande.
    - `/order/delete/id` **[POST]** : **supprimer** un commande.
    - `/order/id` **[GET]** : **consulter** une commande.
    - `/order/all` **[GET]** : **consulter** toutes les commandes.
    - `/order/import` **[POST]** : import CSV.
- CRUD emplacements :
    - `/position/create` **[POST]** : **créer** un emplacement.
    - `/position/update/id` **[POST]** : **modifier** un emplacement.
    - `/position/delete/id` **[POST]** : **supprimer** un emplacement.
    - `/position/id` **[GET]** : **consulter** un emplacement.
- CRUD stocks : entré des stocks en import CSV :
    - `/product/{id}` **[GET]** / **SUPERVISEUR** : récupérer les infos d'un produit agrâce à son identifiant.
    - `/product/all` **[GET]** / **SUPERVISEUR** : récupérer la liste de tous les produits.
    - `/product/add` **[POST]** / **SUPERVISEUR**: ajouter une quantité de stockage à un produit.
        - `productID`: id de l'objet au quel ajouter une quantité X à la quantité actuelle.
        - `quantityToAdd`: quantité X à ajouter.
    - `/product/take` **[POST]** / **SUPERVISEUR** : retier une quantité X à la quantité actuelle. Si la quantité à retirer est supréieure à la quantité en stock, le nouveau stock sera de 0.
        - `productID`: id de l'objet au quel retier une quantité X à la quantité actuelle. 
        - `quantityToTake`: quantité X à retirer.
    - `/product/create` **[POST]** / **SUPERVISEUR** : ajout un nouveau produit à la liste. Si l'emplacement au quel ajouter ce produit est déjà lié à un autre porduit une `BadRequest` est retrounée.
        - `productCode`: code du produit.
        - `quantity`: quantité initiale.
        - `libel` : nom du produit.
        - `height` : hauteur du produit.
        - `length` : longueur du produit.
        - `width` : largeur du produit.
        - `zone` : nom de la zone de stockage du produit.
        - `driveway` : nom de l'allée de stockage du produit.
        - `location` : numéro d'emplacment de stockage du produit.
        - `level` : numéro du niveau de stockage sur l'empalcement du produit.
    - `/product/delete/{id}` **[DELETE]** / **SUPERVISEUR**.
- Génération d'une organisation optimale d'un support en fonction de son contenant et contenu.

## Front

### Défition des données utilisées

Définir les données nécessaire au front pour permettre à l'équipe back de définir une documentation d'api claire et précise au plus vite.

## TODO 

- [ ] dimensions(pLl) type de support dans BDD.
- [ ] recalculer les placements optimaux des produits en cas de manquant.
- [ ] corriger l'orthographe de la BDD. 