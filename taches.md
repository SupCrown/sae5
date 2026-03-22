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

IP : 147.93.55.68

Compte admin : 421

Compte prep : 422, 423

### Documentation API

Définir les endpoints avant de les développer pour permettre à l'equipe front de travailler sans se poser de questions.

### BDD

- MCD
- Création des tables

### API

#### Authentification

- `/login` **[POST]**.: Récupérer le JWT d'authentification.
    - `login` : entier à trois chiffres (`000 - 999`)
        - Réponses :
        - `200` : Utilisateur connecté,
        - `401` : Aucune authentification détectée,
        - `403` : Accès refusé par manque de droits.
    - `/logout` **[POST]** : Supprimer le JWT d'authentification.

#### Attribution des commandes et gestion du parcours de collecte

- `/order/autoAssign` **[POST]** : Assignation d'une commande automatiquemenet (au chargement de l'application) en f° d'un PreparateurID et renvoi de la première étape.
    - **Si aucune commande en cours pour le préparateur** : chargement d'une commande en attente.
        - `200` : la commande est assignée,
        - `204` : aucune commande à assigner a été trouvée.
    - **Sinon** : récupération d'une commande en cours en cas de crash. 
        - `307` : la prépration de la commande n'avait pas été finalisée à la dernière fermeture de l'application.
- `/order/manualAssign?CommandeID=xxx&PreparateurID=yyy` **[POST]** : Assignation d'une commande manuellement en fonction d'un id d'utilisateur et renvoi de la première étape.
- `/order/nextStep?orderId=xxx?missingItem=yyy` **[POST]** : Udapte d'une commande et renvoi de l'étape suivante.
    - Si la **quantité validée == quantité servie** OU s'il y a **au moins un colis manquant** sur la quantité validée.

#### Calcul et envoi des statistiques pour superviseurs et préparateurs

- `/user/stats/{id}` **[GET]** / **SUPERVISEUR** : statistiques d'un préparateur.
- `/user/stats` **[GET]** / **SUPERVISEUR** : statistiques de tous les préparateurs.

#### CRUD utilisateur `Préparateurs / Superviseurs`

- `/user/create` **[POST]** / **SUPERVISEUR** : **créer** un préparateur :
    - `firstname` : prénom de l'utilisateur,
    - `lastname` : nom de l'utilisateur,
    - `login` : login de l'utilisateur,
    - `admin` : est-ce que l'utilisateur est un superviseur.
- `/user/update/{id}` **[POST]** / **SUPERVISEUR**  : **modifier** un préparateur.
- `/user/delete/{id}` **[DELETE]** / **SUPERVISEUR**  : **supprimer** un préparateur.
- `/user/{id}` **[GET]** / **SUPERVISEUR**: **consulter** un préparateur.
- `/user/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** tous les préparateurs ordonnés par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.

#### CRUD commandes

- `/order/create` **[POST]** / **SUPERVISEUR** : **créer** un commande.
- `/order/update/{id}` **[POST]** / **SUPERVISEUR** : **modifier** un commande.
- `/order/delete/{id}` **[POST]** / **SUPERVISEUR** : **supprimer** un commande.
- `/order/{id}` **[GET]** / **SUPERVISEUR** : **consulter** une commande.
- `/order/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** toutes les commandes ordonnées par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.
- `/order/import` **[POST]** / **SUPERVISEUR** : import CSV.

#### CRUD emplacements / allées / niveaux

##### Emplacements
- `/position/create` **[POST]** / **SUPERVISEUR** : **créer** un emplacement :
    - `locationCode` : code du nouvel emplacement.
    - `drivewayId` : identifiant de l'allée.
    - `levelId` : identifiant du niveau.
- `/position/update/{id}` **[POST]** / **SUPERVISEUR** : **modifier** un emplacement.
- `/position/delete/{id}` **[POST]** / **SUPERVISEUR** : **supprimer** un emplacement.
- `/position/{id}` **[GET]** / **SUPERVISEUR** : **consulter** un emplacement.
- `/position/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** tous les emplacements ordonnés par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.

##### Allées

- `/driveway/{id}` **[GET]** / **SUPERVISEUR** : **consulter** une allée.
- `/driveway/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** toutes les allées ordonnées par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.

##### Niveaux

- `/level/{id}` **[GET]** / **SUPERVISEUR** : **consulter** un niveau.
- `/level/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** tous les niveaux ordonnés par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.

#### CRUD stocks : entré des stocks en import CSV 

- `/product/{id}` **[GET]** / **SUPERVISEUR** : récupérer les infos d'un produit agrâce à son identifiant.
- `/product/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** tous les produits ordonnés par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.
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

## Front

### Défition des données utilisées

Définir les données nécessaire au front pour permettre à l'équipe back de définir une documentation d'api claire et précise au plus vite.

## TODO 

- [ ] dimensions(pLl) type de support dans BDD.
- [ ] recalculer les placements optimaux des produits en cas de manquant.
- [ ] corriger l'orthographe de la BDD. 