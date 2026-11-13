# CareerVerse

Portfolio professionnel interactif construit avec React, TypeScript, Vite et React Three Fiber.

## Démarrer

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Le port `5173` peut ensuite être ouvert depuis l’onglet **Ports** de GitHub Codespaces.

Vérifications disponibles :

```bash
npm run typecheck
npm run build
```

## Contenu de démonstration

Les panneaux sont remplis avec des exemples fictifs pour prévisualiser le rendu. Ils sont signalés dans l’interface et ne décrivent pas le parcours réel du propriétaire. Les textes et les exemples se trouvent dans `src/features/portfolio/data/content.ts`; remplacez-les avant publication professionnelle.

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy-pages.yml` vérifie les types, construit le site et le publie après chaque push sur `main`, une fois GitHub Pages activé. Dans **Settings → Pages**, choisissez **GitHub Actions** comme source de déploiement. Le build de production utilise le chemin du dépôt `/career-campus-3d/`.

Le dépôt est actuellement privé. La disponibilité de Pages avec un dépôt privé dépend de la formule GitHub et des paramètres du dépôt. Le rendre public exposerait aussi son code source et n’est pas fait automatiquement.

## Organisation du code

```text
src/
├── app/                         # Composition de l’application et éléments de son interface
│   ├── components/
│   └── App.tsx
├── features/
│   ├── campus/
│   │   ├── data/                # Données et paramètres du campus
│   │   └── scene/               # Scène 3D, bâtiments, terrain et personnage
│   ├── navigation/              # Choix et accès direct aux destinations
│   └── portfolio/               # Présentation des contenus d’un espace
├── shared/                      # Ressources transversales, dont les styles globaux
└── main.tsx                     # Point d’entrée React
```

### Principes

- `app/` assemble les fonctionnalités et conserve l’état d’interface.
- `features/campus/data/campus.ts` est la source de vérité des bâtiments, positions et paramètres de déplacement.
- `features/campus/scene/` contient le rendu 3D et les comportements liés au monde.
- `features/navigation/` et `features/portfolio/` portent des interfaces séparées, prêtes à évoluer avec les contenus.
- `features/portfolio/data/content.ts` sépare les textes éditoriaux des données de géométrie et définit un modèle réutilisable pour les fiches projet.
- `shared/` reste réservé aux éléments véritablement transversaux.
- Les données de portfolio restent indépendantes des composants 3D afin de pouvoir enrichir les contenus sans reconstruire le campus.
- `CampusExperience` est chargé dynamiquement : l'interface et la navigation arrivent avant le moteur et la scène 3D.

L'écran de chargement suit les étapes réelles de démarrage (interface, module 3D, renderer, première frame). Son pourcentage représente ces jalons, pas le volume en octets. La scène est actuellement générée en code et n'a pas encore de modèles ou textures distants à charger.

## Échelle et scène du campus

Le campus conserve ses six destinations en éventail autour de la place. Les bâtiments sont répartis jusqu'à environ 42 unités du centre, avec une limite de déplacement de 82 unités. Le terrain vallonné comprend des chemins principaux courbes, des sentiers secondaires vers un belvédère et un étang, des bosquets et des plantations. Les proportions restent configurables dans `features/campus/data/campus.ts` et `features/campus/scene/` ; après tout changement d'échelle, vérifier ensemble les entrées, collisions, chemins et cadrage.

La scène utilise des géométries Three.js légères, sans textures ou modèles distants. Les façades partagent des matériaux et une structure cohérente, avec trois variations architecturales, des vitrages, des auvents, des panneaux de toit et des plantations d'entrée. Le centre dispose d'une fontaine, de bancs, de massifs et d'un éclairage de chemin.
