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

- `/order/autoAssign` **[GET]** / **PREPARATEUR** : Assignation d'une commande automatiquemenet.
    - **Si aucune commande en cours pour le préparateur** : chargement d'une commande en attente.
        - `200` : la commande est assignée,
        - `204` : aucune commande à assigner a été trouvée.
    - **Sinon** : récupération d'une commande en cours en cas de crash et renvoie de la dernière étape ainsi que tous les produits déjà placés.
        - `307` : la prépration de la commande n'avait pas été finalisée à la dernière fermeture de l'application.
```json
{
    "type": "Type de retour : NEW_SUPPORT, PICK_PRODUCT, FINISHED, NO_ORDERS, QUEUED",
    "step": {
        "productId": "ID du produit de l'étape",
        "x": "Abscisse de la boite",
        "y": "Oronnée de la boite",
        "z": "Altitude de la boite",
        "dx": "Largeur de la boite",
        "dy": "Profondeur de la boite",
        "dz": "Hauteur de la boite",
        "surfaces": [
            {
                "label": "Surfface sur laquelle est posée la boite",
                "attributes": {}
            }
        ]
    },
    "placedProducts": [
        {
            "productId": "ID du produite déjà placé",
            "x": "Abscisse de la boite",
            "y": "Oronnée de la boite",
            "z": "Altitude de la boite",
            "dx": "Largeur de la boite",
            "dy": "Profondeur de la boite",
            "dz": "Hauteur de la boite",
            "surfaces": [
                {
                    "label": "Surfface sur laquelle est posée la boite",
                    "attributes": {}
                }
            ]
        },
        {
            ...
        }
    ],
    "placedQuantity": "Quantité déjà posée",
    "quantityToPlace": "Quantité à poser",
    "orderID": "ID de la commande courante",
    "location": "Empalcement du produit"
}
```
- `/order/manualAssign?CommandeID=xxx&PreparateurID=yyy` **[GET]** / **SUPERVISEUR** : Assignation d'une commande manuellement en fonction d'un id d'utilisateur et renvoi de la première étape.
- `/order/nextStep?orderID=xxx?missingItem=yyy` **[GET]** / **PREPARATEUR** : Udapte d'une commande et renvoi de l'étape suivante :
```json
{
    "type": "Type de retour : NEW_SUPPORT, PICK_PRODUCT, FINISHED, NO_ORDERS, QUEUED",
    "step": {
        "productId": "ID du produit de l'étape",
        "x": "Abscisse de la boite",
        "y": "Oronnée de la boite",
        "z": "Altitude de la boite",
        "dx": "Largeur de la boite",
        "dy": "Profondeur de la boite",
        "dz": "Hauteur de la boite",
        "surfaces": [
            {
                "label": "Surfface sur laquelle est posée la boite",
                "attributes": {}
            }
        ]
    },
    "placedProducts": null,
    "placedQuantity": "Quantité déjà posée",
    "quantityToPlace": "Quantité à poser",
    "orderID": "ID de la commande courante",
    "location": "Empalcement du produit"
}
```

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

- `/order/create` **[POST]** / **SUPERVISEUR** : **créer** une commande :
```json
{
    "orderDate" : "Date de la commande ex : '2026-03-23'",
    "customerID" : "ID du clien", 
    "priority" : "(booléen) est-ce que la commande dois-être réalisée en prioritée",
    "supports" : [
        {
            "typeID" : "Identifiant du type de support",
            "products" : [
                {
                    "productID" : "Identifiant du produit à ajouter dans le support",
                    "quantity" : "Quantité du produit sur la support de la commande"
                },
                {
                    "..."
                }
            ]
        },
        {
            "..."
        }
    ],
}
```
- `/order/update/{id}` **[POST]** / **SUPERVISEUR** : **modifier** une commande.
- `/order/delete/{id}` **[DELETE]** / **SUPERVISEUR** : **supprimer** une commande.
- `/order/{id}` **[GET]** / **SUPERVISEUR** : **consulter** une commande.
- `/order/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** toutes les commandes ordonnées par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.
- `/order/import` **[POST]** / **SUPERVISEUR** : import CSV : 
```json
{
    "orderDate" : "Date de la commande ex : '2026-03-23'",
    "customerID" : "ID du clien", 
    "priority" : "(booléen) est-ce que la commande dois-être réalisée en prioritée",
    "typeID" : "type des supports à importer",
    "file" : "fichier csv contenant les infos des support à importer"
}
```


#### CRUD clients

- `/customer/create` **[POST]** / **SUPERVISEUR** : **créer** un client :
```json
{
    "name" : "Nom du client",
    "code" : "Code à 5 chiffre unique du client"
}
```
- `/customer/delete/{id}` **[DELETE]** / **SUPERVISEUR** : **supprimer** un client.
- `/customer/{id}` **[GET]** / **SUPERVISEUR** : **consulter** un client.
- `/customer/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** tous les clients ordonnés par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.

#### CRUD types de support

- `/supportType/{id}` **[GET]** / **SUPERVISEUR** : **consulter** un type de support.
- `/supportType/all?page=x?size=y` **[GET]** / **SUPERVISEUR** : **consulter** tous les types de support ordonnés par des pages :
    - `page` : valeur par défaut `0`.
    - `size` : valeur par défaut `20`.

#### CRUD emplacements / allées / niveaux

##### Emplacements
- `/position/create` **[POST]** / **SUPERVISEUR** : **créer** un emplacement :
    - `locationCode` : code du nouvel emplacement.
    - `drivewayId` : identifiant de l'allée.
    - `levelId` : identifiant du niveau.
- `/position/update/{id}` **[POST]** / **SUPERVISEUR** : **modifier** un emplacement.
- `/position/delete/{id}` **[DELETE]** / **SUPERVISEUR** : **supprimer** un emplacement.
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
```json
{
    "productID" : "id de l'objet au quel retier une quantité X à la quantité actuelle",
    "quantityToAdd" : "quantité X à ajouter"
}
```
- `/product/take` **[POST]** / **SUPERVISEUR** : retier une quantité X à la quantité actuelle. Si la quantité à retirer est supréieure à la quantité en stock, le nouveau stock sera de 0.
```json
{
    "productID" : "id de l'objet au quel retier une quantité X à la quantité actuelle",
    "quantityToTake" : "quantité X à retirer"
}
```
- `/product/create` **[POST]** / **SUPERVISEUR** : ajout un nouveau produit à la liste. Si l'emplacement au quel ajouter ce produit est déjà lié à un autre porduit une `BadRequest` est retrounée.
```json
{
    "productCode" : "code du produit",
    "quantity" : "quantité initiale",
    "libel" : "nom du produit",
    "height" : "hauteur du produit",
    "length" : "longueur du produit",
    "width" : "largeur du produit",
    "zone" : "nom de la zone de stockage du produit",
    "driveway" : "nom de l'allée de stockage du produit",
    "location" : "numéro d'emplacment de stockage du produit"
}
```
- `/product/delete/{id}` **[DELETE]** / **SUPERVISEUR**.

## Front

### Défition des données utilisées

Définir les données nécessaire au front pour permettre à l'équipe back de définir une documentation d'api claire et précise au plus vite.

## TODO 

- [ ] dimensions(pLl) type de support dans BDD.
- [ ] recalculer les placements optimaux des produits en cas de manquant.
- [ ] corriger l'orthographe de la BDD. 