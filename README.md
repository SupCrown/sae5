# Aramis - Documentation technique

Application composée de deux modules :
- `API_Aramis` : API REST Spring Boot + PostgreSQL + reverse proxy Nginx (Docker Compose).
- `front_aramis` : client web React/Vite.

## 1) Architecture du projet

```
.
├── API_Aramis/        # Backend Java (Spring Boot, Maven)
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── src/main/resources/
├── front_aramis/      # Frontend React + Vite
│   └── package.json
├── create_database_table.sql
└── jeu_essai.sql
```

## 2) Prerequis

### Outils systeme
- `git`
- `Docker` + `Docker Compose` (recommande pour l'API)
- `Node.js` (LTS recente) + `npm`

### Prerequis backend hors Docker (optionnel)
- `Java 17`
- `Maven 3.9+`
- `PostgreSQL 15+`

## 3) Dependances techniques du projet

### Backend (`API_Aramis`)
Dependances principales Maven :
- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `postgresql`
- `spring-boot-starter-validation`
- `spring-boot-starter-actuator`
- `jjwt-*` (auth JWT)
- `lombok`
- `com.github.skjolber.3d-bin-container-packing:core`

### Frontend (`front_aramis`)
Dependances principales NPM :
- `react`, `react-dom`, `react-router-dom`
- `vite`
- `three`, `@react-three/fiber`, `@react-three/drei`
- `eslint` + plugins React
- `tailwindcss`, `postcss`, `autoprefixer`

Toutes ces dependances sont installees automatiquement via :
- `npm install` pour le frontend
- `mvn` lors du build backend

## 4) Lancer l'application (workflow recommande)

Le workflow recommande est :
1. demarrer l'API via Docker Compose
2. demarrer le frontend Vite

### 4.1 Demarrage de l'API (Docker)

Depuis le dossier `API_Aramis`, creer un fichier `.env` :

```env
POSTGRES_USER=dev
DB_PASSWORD=c1abricot
JWT_SECRET=Qk-+ZSz4lolLCnQ5EWScN/PK9BZ=yOFwQyV7
```

Puis executer :

```bash
cd API_Aramis
docker-compose up --build -d
```

Services demarres :
- `aramis-db` : PostgreSQL (port interne `5432`, non publie sur l'hote)
- `aramis-api` : Spring Boot (port interne `8080`)
- `aramis-proxy` : Nginx reverse proxy expose sur le port `80`

> Si le port `80` est deja occupe sur la machine, le conteneur `aramis-proxy` ne demarrera pas. L'API et la base resteront fonctionnelles ; il faudra alors soit liberer le port 80, soit modifier le mapping de port dans `docker-compose.yml` (ex. `"8081:80"`).

Pour suivre les logs :

```bash
docker-compose logs -f
```

Pour arreter :

```bash
docker-compose down
```

### 4.2 Demarrage du frontend web

```bash
cd front_aramis
npm install
npm run dev
```

Le serveur Vite est disponible sur :
- `http://localhost:5173`

## 5) Lancement backend hors Docker (optionnel)

Si vous ne voulez pas utiliser Docker :
1. disposer d'une base PostgreSQL accessible
2. definir les variables d'environnement minimales
3. lancer Spring Boot

Exemple :

```bash
cd API_Aramis
export POSTGRES_USER=dev
export DB_PASSWORD=c1abricot
export SPRING_DATASOURCE_URL=jdbc:postgresql://147.93.55.68:5432/aramisdev
export COM_GROUP_PROJECT_JWT_SECRET=Qk-+ZSz4lolLCnQ5EWScN/PK9BZ=yOFwQyV7
mvn spring-boot:run
```

## 6) Scripts utiles

### Front (`front_aramis/package.json`)
- `npm run dev` : demarrage Vite (developpement)
- `npm run build` : build de production frontend
- `npm run preview` : previsualisation du build
- `npm run lint` : lint ESLint

### Back (`API_Aramis`)
- `docker-compose up --build -d` : build + lancement stack API/DB/proxy
- `docker-compose down` : arret de la stack
- `mvn clean package -DskipTests` : build JAR backend

## 7) Notes d'exploitation

- Le profil Spring actif par defaut est `development` (voir `application.properties`).
- Les proprietes JWT/cookie sont configurees sous le prefixe `com.group.project.*`.
- Le scripts SQL `jeu_essai.sql` peux servir a peupler une base hors Docker selon le besoin de l'equipe.
