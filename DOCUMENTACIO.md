# 📋 Documentació — LoL Tracker

## Aplicació Web de Seguiment de League of Legends

---

## Portada

**Títol:** LoL Tracker — Aplicació Web Vue.js  
**Assignatura:** Informàtica  
**Autor:** Skirr  
**Data:** Maig 2026  
**Tecnologies:** Vue.js 3, Vite, Express.js, Riot Games API, Data Dragon CDN  
**Enllaç al servidor:** `http://localhost:5173` (frontend) · `http://localhost:3001` (backend)

---

## Índex

1. [Introducció](#1-introducció)
2. [Arquitectura del Projecte](#2-arquitectura-del-projecte)
3. [Estructura de Fitxers](#3-estructura-de-fitxers)
4. [Fitxers Afegits i Modificats](#4-fitxers-afegits-i-modificats)
   - 4.1 Backend (server/)
   - 4.2 Configuració del Projecte
   - 4.3 Router i Serveis
   - 4.4 Components Layout
   - 4.5 Components de Cerca
   - 4.6 Vistes (Pàgines)
   - 4.7 Estils Globals
5. [Pàgina 1 — Landing Page](#5-pàgina-1--landing-page)
6. [Pàgina 2 — Cerca d'Invocadors (API)](#6-pàgina-2--cerca-dinvocadors-api)
7. [Pàgina 3 — CRUD Tier List Builder](#7-pàgina-3--crud-tier-list-builder)
8. [Funcionalitats Extra](#8-funcionalitats-extra)
9. [Comprovacions del Funcionament](#9-comprovacions-del-funcionament)
10. [Comentaris i Feedback](#10-comentaris-i-feedback)

---

## 1. Introducció

LoL Tracker és una aplicació web desenvolupada amb **Vue.js 3** que permet als jugadors de League of Legends consultar estadístiques d'invocadors, veure l'historial de partides i crear tier lists personalitzades. L'aplicació consumeix les APIs oficials de Riot Games a través d'un servidor proxy Express.js.

L'objectiu del projecte és crear una eina similar a les populars webs **op.gg** i **League of Graphs**, amb un disseny professional, net i minimalista inspirat en l'estètica de League of Legends.

---

## 2. Arquitectura del Projecte

L'aplicació segueix una arquitectura client-servidor:

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Frontend (Vue 3)  │────▶│  Backend (Express)│────▶│   Riot Games APIs   │
│   Port: 5173        │     │  Port: 3001       │     │   (account, match,  │
│                     │     │  Proxy + API Key  │     │    league, mastery)  │
└─────────────────────┘     └──────────────────┘     └─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Data Dragon CDN    │
│  (imatges, dades)   │
│  No requereix key   │
└─────────────────────┘
```

**Per què un backend proxy?**
- La clau API de Riot no es pot exposar al client (seguretat)
- Riot bloqueja les peticions CORS des del navegador
- Permet gestionar rate limits i caching

---

## 3. Estructura de Fitxers

```
tracker_lol/
├── index.html                      # Punt d'entrada HTML
├── package.json                    # Dependències frontend
├── vite.config.js                  # Configuració Vite
├── server/                         # Backend proxy
│   ├── server.js                   # Servidor Express
│   ├── .env                        # Clau API (no es puja a Git)
│   └── package.json                # Dependències backend
└── src/                            # Codi font frontend
    ├── main.js                     # Entry point Vue
    ├── App.vue                     # Component arrel
    ├── style.css                   # Estils globals
    ├── router/
    │   └── index.js                # Configuració Vue Router
    ├── services/
    │   ├── riotApi.js              # Servei de crides al backend
    │   └── dataDragon.js           # Servei de Data Dragon (CDN)
    ├── views/
    │   ├── HomeView.vue            # Pàgina 1: Landing
    │   ├── SearchView.vue          # Pàgina 2: Cerca + Stats
    │   └── TierListView.vue        # Pàgina 3: CRUD
    └── components/
        ├── layout/
        │   ├── NavBar.vue          # Barra de navegació
        │   └── FooterBar.vue       # Peu de pàgina
        └── search/
            ├── SearchBar.vue       # Barra de cerca reutilitzable
            ├── RankCard.vue        # Targeta de rang
            ├── MatchCard.vue       # Targeta de partida
            └── MasteryCard.vue     # Targeta de maestria
```

---

## 4. Fitxers Afegits i Modificats

### 4.1 Backend (`server/`)

#### `server/server.js`
**Propòsit:** Servidor Express.js que actua com a proxy per les crides a les APIs de Riot Games. Gestiona el routing de regions (EUW, NA, KR, etc.) i afegeix la clau API de forma segura.

**Endpoints creats:**
| Ruta | Funció |
|------|--------|
| `GET /api/account/:region/:gameName/:tagLine` | Obtenir PUUID per Riot ID |
| `GET /api/summoner/:region/:puuid` | Dades de l'invocador |
| `GET /api/league/:region/:summonerId` | Rang i LP |
| `GET /api/matches/:region/:puuid` | IDs de partides |
| `GET /api/match/:region/:matchId` | Detalls d'una partida |
| `GET /api/mastery/:region/:puuid` | Maestria de campions |

> 📸 **Captura:** Captura del codi del servidor amb els endpoints visibles.

#### `server/.env`
**Propòsit:** Fitxer de variables d'entorn amb la clau API de Riot. No es puja mai al repositori (afegir a `.gitignore`).

> 📸 **Captura:** Captura del fitxer .env (amb la clau parcialment oculta per seguretat).

#### `server/package.json`
**Propòsit:** Defineix les dependències del backend: `express`, `axios`, `dotenv`, `cors`.

---

### 4.2 Configuració del Projecte

#### `index.html`
**Modificat.** S'han afegit meta tags SEO (description, theme-color), idioma `ca` i un títol descriptiu.

> 📸 **Captura:** Captura del codi de l'index.html amb les meta tags.

#### `package.json` (arrel)
**Modificat.** S'han afegit les dependències `vue-router` i `axios` al projecte Vue.

#### `src/main.js`
**Modificat.** S'ha configurat Vue Router i els estils globals. S'ha eliminat el contingut de demo de Vite.

> 📸 **Captura:** Captura del main.js amb la configuració de Vue i Router.

---

### 4.3 Router i Serveis

#### `src/router/index.js`
**Nou.** Configuració de Vue Router amb 4 rutes:
- `/` → Landing Page
- `/search` → Pàgina de cerca
- `/search/:region/:gameName/:tagLine` → Perfil d'invocador (dinàmica)
- `/tierlist` → CRUD Tier Lists

Inclou `scrollBehavior` per tornar al top en navegar i actualització dinàmica del `<title>`.

> 📸 **Captura:** Captura del codi del router amb les rutes definides.

#### `src/services/riotApi.js`
**Nou.** Servei que encapsula totes les crides HTTP al backend proxy. Utilitza Axios amb un baseURL apuntant a `localhost:3001`.

**Funcions:** `getAccount()`, `getSummoner()`, `getLeague()`, `getMatchIds()`, `getMatch()`, `getMastery()`

> 📸 **Captura:** Captura del codi del servei riotApi.js.

#### `src/services/dataDragon.js`
**Nou.** Servei per accedir al CDN de Data Dragon de Riot. Gestiona la versió actual del joc, dades de campions, imatges i mapejos (spells, cues).

Inclou **caching** per evitar peticions repetides.

> 📸 **Captura:** Captura del codi de dataDragon.js amb les funcions de cache i URLs.

---

### 4.4 Components Layout

#### `src/components/layout/NavBar.vue`
**Nou.** Barra de navegació responsive amb:
- Logo LoL Tracker amb icona SVG
- Enllaços a les 3 pàgines
- Efecte glass (blur) i detecció de scroll
- Menú hamburguesa per a mòbil
- Indicador visual de la pàgina activa

> 📸 **Captura:** Captura de la navbar en desktop i en mòbil (hamburger obert).

#### `src/components/layout/FooterBar.vue`
**Nou.** Peu de pàgina amb:
- Branding LoL Tracker
- Enllaços de navegació
- Crèdits del desenvolupador
- Disclaimer legal de Riot Games
- Layout responsiu amb grid

> 📸 **Captura:** Captura del footer complet.

---

### 4.5 Components de Cerca (Reutilitzables)

#### `src/components/search/SearchBar.vue`
**Nou.** Component de cerca reutilitzat a la Landing i a la pàgina de Search:
- Selector de regió (EUW, NA, KR, etc.)
- Input per al Riot ID (format Nom#TAG)
- Validació en temps real
- Variant `large` per al hero de la landing
- Navegació automàtica al perfil en fer submit

> 📸 **Captura:** Captura de la SearchBar en la landing (gran) i en la pàgina de cerca (normal).

#### `src/components/search/RankCard.vue`
**Nou.** Targeta que mostra el rang d'un invocador:
- Icona del rang (de CommunityDragon)
- Tier, divisió i LP
- Winrate amb barra de progrés i colors condicionats
- Indicador de color per tier (Iron/Bronze/Gold/Diamond...)

> 📸 **Captura:** Captura d'una RankCard amb dades reals (ex: Gold II - 45LP).

#### `src/components/search/MatchCard.vue`
**Nou.** Targeta per a cada partida de l'historial:
- Indicador de victòria/derrota amb color lateral
- Campió jugat amb imatge
- Summoner spells
- KDA amb colors i ratio
- CS, CS/min i visió
- Items comprats
- Duració i tipus de cua
- Temps transcorregut (fa 2h, fa 3d...)

> 📸 **Captura:** Captura de diversos MatchCards mostrant victòries i derrotes.

#### `src/components/search/MasteryCard.vue`
**Nou.** Targeta de maestria de campió:
- Imatge del campió
- Nivell de maestria (badge)
- Punts formatejats (123.4K, 1.2M)

> 📸 **Captura:** Captura de la llista de MasteryCards amb els campions favorits.

---

### 4.6 Vistes (Pàgines)

#### `src/views/HomeView.vue` — Pàgina 1: Landing Page
**Nou.** Pàgina de presentació del projecte amb:
- **Hero section:** Fons splash de LoL (Yasuo), partícules animades, títol i subtítol
- **Barra de cerca** central (reutilitza SearchBar)
- **Secció de features:** 6 targetes explicant funcionalitats
- **Secció de rangs:** Mostra les 10 icones de rang
- **CTA:** Crida a l'acció amb botó per anar a la cerca
- Animacions fade-in i hover effects

> 📸 **Captura 1:** Captura del hero de la landing amb la barra de cerca.
> 📸 **Captura 2:** Captura de la secció de features.
> 📸 **Captura 3:** Captura de la secció de rangs i CTA.

#### `src/views/SearchView.vue` — Pàgina 2: Cerca i Estadístiques (API)
**Nou.** Pàgina que consumeix les APIs de Riot Games:
- **Cerca d'invocadors** per Riot ID (Nom#TAG)
- **Capçalera de perfil:** Icona, nom, tag, nivell, regió
- **Targetes de rang:** Solo/Duo i Flex amb RankCard
- **Campions favorits:** Top 7 per maestria amb MasteryCard
- **Historial de partides:** Llista amb MatchCard
- **Resum estadístic:** Partides, victòries, derrotes, winrate, KDA mitjà
- **Filtres:** Totes, Ranked Solo, Normal
- **Load more:** Botó per carregar més partides
- **Estats:** Loading (spinner), error, perfil

> 📸 **Captura 1:** Captura de la pàgina de cerca buida amb la barra.
> 📸 **Captura 2:** Captura del perfil complet d'un invocador amb rang i maestria.
> 📸 **Captura 3:** Captura de l'historial de partides amb el resum estadístic.
> 📸 **Captura 4:** Captura dels filtres de partides (Ranked/Normal).
> 📸 **Captura 5:** Captura de l'estat de càrrega (spinner).

#### `src/views/TierListView.vue` — Pàgina 3: CRUD Tier List
**Nou.** CRUD complet amb persistència a localStorage:
- **Create:** Formulari modal per crear tier lists amb nom i descripció
- **Read:** Llista de tier lists creades amb files S/A/B/C/D i campions
- **Update:** Modal d'edició per modificar nom, descripció i campions
- **Delete:** Modal de confirmació abans d'eliminar

Funcionalitats addicionals:
- Selector de campions (tots els campions de LoL carregats de Data Dragon)
- Buscador de campions per nom
- Selector de tier per afegir campions
- Campions ja usats es marquen com a desactivats
- Dades persistides a localStorage

> 📸 **Captura 1:** Captura de la pàgina de tier lists buida (estat buit).
> 📸 **Captura 2:** Captura del modal de creació amb el selector de campions.
> 📸 **Captura 3:** Captura d'una tier list creada amb campions a S/A/B.
> 📸 **Captura 4:** Captura del modal d'edició.
> 📸 **Captura 5:** Captura del modal de confirmació d'eliminació.

---

### 4.7 Estils Globals

#### `src/style.css`
**Nou/Modificat.** Sistema de disseny complet amb:
- **Variables CSS:** Paleta de colors inspirada en LoL (fons foscos, accents daurats i blaus)
- **Tipografia:** Google Fonts (Inter + Cinzel)
- **Utilitats:** Classes `.card`, `.glass`, `.container`, `.text-gold`, etc.
- **Animacions:** fadeInUp, fadeIn, slideInLeft, pulse, shimmer, spin
- **Skeleton loading** i spinner
- **Scrollbar personalitzada**
- **Responsive helpers**
- **Reset CSS** complet

> 📸 **Captura:** Captura del codi de les variables CSS amb la paleta de colors.

---

#### `src/App.vue`
**Modificat.** Component arrel que defineix el layout global:
- Inclou NavBar i FooterBar (components reutilitzats)
- `<router-view>` amb transicions de pàgina (fade in/out)
- Padding-top per al navbar fixe

> 📸 **Captura:** Captura del codi d'App.vue.

---

## 5. Pàgina 1 — Landing Page

La landing page serveix com a portada del projecte. Presenta l'aplicació amb un disseny visual impactant inspirat en League of Legends.

**Seccions:**
1. **Hero:** Imatge de fons (splash art Yasuo) amb overlay, partícules daurades animades, títol amb tipografia Cinzel, subtítol i barra de cerca
2. **Features:** 6 targetes explicant les funcionalitats principals
3. **Rangs:** Mostra les 10 icones de rang competitiu
4. **CTA:** Botó d'acció per començar a cercar

> 📸 **Captura:** Captura completa de la landing page.

---

## 6. Pàgina 2 — Cerca d'Invocadors (API)

Aquesta pàgina consumeix múltiples APIs de Riot Games per mostrar dades en temps real.

**APIs consumides:**
| API | Ús |
|-----|-----|
| account-v1 | Obtenir PUUID per Riot ID |
| summoner-v4 | Dades del perfil (icona, nivell) |
| league-v4 | Rang, LP, winrate |
| match-v5 | Historial de partides amb detalls |
| champion-mastery-v4 | Campions favorits per maestria |

**Flux de dades:**
1. L'usuari introdueix un Riot ID → es navega a `/search/euw1/Nom/TAG`
2. Vue Router detecta el canvi → crida `fetchSummoner()`
3. Es fan 5 crides seqüencials al backend proxy
4. Les dades es mostren en components dedicats

> 📸 **Captura 1:** Captura de la cerca amb resultats (perfil complet).
> 📸 **Captura 2:** Captura de les targetes de rang Solo/Duo i Flex.
> 📸 **Captura 3:** Captura de l'historial de partides.

---

## 7. Pàgina 3 — CRUD Tier List Builder

El CRUD permet crear, llegir, actualitzar i eliminar tier lists de campions.

| Operació | Descripció | Persistència |
|----------|------------|-------------|
| **Create** | Crear nova tier list amb nom, descripció i campions | localStorage |
| **Read** | Llistar totes les tier lists amb les files S/A/B/C/D | localStorage |
| **Update** | Editar nom, descripció i reorganitzar campions | localStorage |
| **Delete** | Eliminar amb confirmació modal | localStorage |

Les dades es guarden a `localStorage` amb la clau `lol-tier-lists`.

> 📸 **Captura:** Captura demostrant les 4 operacions CRUD.

---

## 8. Funcionalitats Extra

### ✅ Header/Navbar
- Navegació entre les 3 pàgines
- Indicador de pàgina activa
- Efecte glass amb blur
- Responsive amb hamburger menu

### ✅ Footer
- Informació del creador
- Enllaços de navegació
- Disclaimer legal Riot Games

### ✅ Responsive
- Disseny mobile-first
- Breakpoints: 768px, 1024px
- Navbar col·lapsable
- Grid adaptatiu

### ✅ Navegació per rutes
- Vue Router amb `createWebHistory()`
- Rutes: `/`, `/search`, `/search/:region/:gameName/:tagLine`, `/tierlist`
- Transicions de pàgina

### ✅ Codi reutilitzat
| Component | Reutilitzat a |
|-----------|--------------|
| SearchBar | Landing + Search |
| RankCard | Search (x2: Solo + Flex) |
| MatchCard | Search (x10-20 partides) |
| MasteryCard | Search (x7 campions) |
| NavBar | Totes les pàgines |
| FooterBar | Totes les pàgines |

---

## 9. Comprovacions del Funcionament

### 9.1 Landing Page
> 📸 **Captura:** La landing page carrega correctament amb el hero, features i rangs.

### 9.2 Navegació
> 📸 **Captura:** Navegació entre les 3 pàgines funciona correctament.

### 9.3 Cerca d'Invocador
> 📸 **Captura:** Cercar un invocador (ex: Thebausffs#EUW) mostra el perfil complet.

### 9.4 Historial de Partides
> 📸 **Captura:** L'historial mostra partides amb KDA, items, CS i duració.

### 9.5 Filtres de Partides
> 📸 **Captura:** Els filtres (Totes, Ranked, Normal) funcionen correctament.

### 9.6 CRUD — Crear Tier List
> 📸 **Captura:** Crear una tier list amb campions al Tier S.

### 9.7 CRUD — Editar Tier List
> 📸 **Captura:** Editar el nom i afegir campions a una tier list existent.

### 9.8 CRUD — Eliminar Tier List
> 📸 **Captura:** Confirmar i eliminar una tier list.

### 9.9 Responsive — Mòbil
> 📸 **Captura:** L'aplicació en resolució mòbil amb el hamburger menu.

### 9.10 Backend Proxy
> 📸 **Captura:** El servidor Express corrent i responent peticions.

---

## 10. Comentaris i Feedback

*(Apartat opcional — afegeix comentaris sobre el procés si ho consideres necessari)*

---

> **Nota legal:** LoL Tracker no està avalat per Riot Games i no reflecteix les opinions de Riot Games ni de ningú involucrat en la producció o gestió de propietats de Riot Games. League of Legends i Riot Games són marques registrades de Riot Games, Inc.
