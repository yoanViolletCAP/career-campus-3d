alors je vais t'envoyer du texte et tu vas créer un fichier CDC .md

# Cahier des charges — Portfolio Campus 3D
**Version :** 1.0 — Cadrage initial
**Nature :** Portfolio professionnel interactif
**Public cible :** Entreprise d'alternance, responsables de mission, recruteurs et futurs employeurs

## 1. Objectif du projet
Développer un site web 3D interactif permettant de présenter un parcours professionnel, des compétences et des réalisations à travers l'exploration d'un campus virtuel.

Le site doit servir à la fois de book de fin d'alternance et de portfolio professionnel personnel.

L'expérience doit être originale, immersive et ludique, sans sacrifier la lisibilité, le sérieux et l'accessibilité des informations.

## 2. Direction artistique
**Référence principale :** [https://bruno-simon.com](https://bruno-simon.com/)

Le site reprendra certains principes graphiques de cette référence :

- Univers 3D stylisé et cohérent.
- Caméra légèrement surélevée suivant le personnage.
- Animations fluides et interactions visuelles.
- Environnement miniature exploré directement dans le navigateur.
- Objets et bâtiments simples mais soignés.
L'identité graphique sera néanmoins plus professionnelle et légèrement plus réaliste, notamment au niveau des bâtiments, matériaux, éclairages et éléments de signalétique.

L'objectif n'est pas de reproduire le jeu ou les mécaniques de Bruno Simon.

## 3. Architecture du campus
Le campus comportera six bâtiments accessibles depuis un espace central :

BâtimentFonction01 — ProfilPrésentation personnelle, parcours, compétences, CV02 — Projet majeur 1Première réalisation importante03 — Projet majeur 2Deuxième réalisation importante04 — Projet majeur 3Troisième réalisation importante05 — Autres missionsPrésentation des contributions et projets secondaires06 — VeoliaEnsemble des expériences, missions et réalisations chez VeoliaLes trois projets majeurs seront définis ultérieurement. Les bâtiments correspondants utiliseront temporairement des contenus de démonstration.

Les bâtiments partageront une architecture commune, avec des variations discrètes selon leur thématique : couleurs, enseignes, éléments décoratifs, équipements et logos.

Les logos Capgemini Engineering, Airbus Helicopters et Veolia pourront apparaître sur les bâtiments ou les panneaux concernés, sous réserve de leur utilisation autorisée.

## 4. Navigation sur ordinateur
Le visiteur contrôlera un personnage à pied, avec une caméra à la troisième personne légèrement surélevée.

Fonctionnalités attendues :

- Déplacement avec ZQSD, WASD ou les flèches directionnelles.
- Caméra suivant automatiquement le personnage.
- Ajustement de la vue avec la souris si pertinent.
- Entrée dans un bâtiment par interaction à proximité.
- Retour libre vers le campus.
- Panneaux directionnels permettant de rejoindre directement les bâtiments.
- Possibilité d'accéder rapidement à une destination sans traverser toute la carte.
Le déplacement devra être simple, fluide et compréhensible même pour un utilisateur qui n'a pas l'habitude des jeux vidéo.

## 5. Fonctionnement des bâtiments
Chaque bâtiment disposera d'un environnement intérieur en 3D.

Les contenus seront présentés à travers des écrans interactifs disposés dans l'espace.

Lorsqu'un personnage s'approche d'un écran :

1. L'écran devient visuellement actif.
2. Une indication d'interaction apparaît.
3. Le visiteur peut afficher le contenu.
4. Une interface lisible présente les informations.
5. Le visiteur peut fermer cette interface et reprendre son exploration.
Les contenus pourront comprendre des textes, captures d'écran, graphiques, illustrations, vidéos et liens.

Les contenus des projets majeurs suivront une structure commune : contexte, problématique, démarche, réalisation, résultats et compétences mobilisées.

Le bâtiment Veolia proposera une organisation plus souple permettant de présenter plusieurs missions différentes.

## 6. Version mobile
Une expérience adaptée sera proposée sur téléphone et tablette.

Le visiteur pourra accéder aux six bâtiments grâce à une interface de navigation simplifiée, sans obligation de contrôler librement un personnage en 3D.

L'objectif principal sera de conserver l'identité graphique et l'accès à l'ensemble des contenus.

## 7. Identité et contenus professionnels
Le portfolio présentera le véritable nom du propriétaire, son parcours, ses compétences et son CV.

Aucune photo personnelle n'est nécessaire.

Les visuels professionnels seront sélectionnés ou créés pour illustrer les réalisations, sans exposer d'informations internes ou confidentielles.

Un accès au CV et aux coordonnées professionnelles sera disponible indépendamment de l'exploration du campus.

## 8. Administration et évolutivité
Aucune interface d'administration ne sera développée dans la V1.

Les modifications de contenus, bâtiments et projets se feront directement dans le code source.

L'architecture devra cependant permettre d'ajouter facilement des projets ou de modifier les informations à l'avenir, idéalement au moyen de fichiers de configuration séparés des composants graphiques.

Une interface d'administration pourra éventuellement être envisagée dans une version ultérieure.

## 9. Architecture technique envisagée

- **React + TypeScript :** application web et interfaces.
- **Three.js / React Three Fiber :** rendu du campus et des bâtiments en 3D.
- **Drei :** composants et utilitaires 3D.
- **Blender :** modélisation et adaptation des éléments graphiques.
- **GSAP :** animations et transitions lorsque nécessaire.
- **Vite :** environnement de développement.
- **GitHub :** versionnement et suivi du code.
- **Vercel :** hébergement envisagé.
Un backend et une base de données ne sont pas nécessaires au périmètre initial.

## 10. Exigences de qualité
Le site devra :

- Fonctionner sur les navigateurs modernes.
- Proposer un chargement progressif des ressources 3D.
- Maintenir une navigation fluide sur un ordinateur courant.
- Permettre la lecture des contenus sans difficulté.
- Fournir une solution de navigation alternative si la 3D ne fonctionne pas.
- Être utilisable avec des contrôles accessibles au clavier.
- Éviter les animations excessives ou gênantes.
- Préserver les informations professionnelles confidentielles.
Les objectifs chiffrés de performance seront fixés puis validés lors des premiers tests.

## 11. Découpage de réalisation
**Phase 1 — Prototype technique**

Création du terrain, de la caméra, du personnage, des déplacements et des six bâtiments simplifiés.

**Phase 2 — Interactions et navigation**

Ajout des entrées, sorties, panneaux directionnels, interactions avec les écrans et transitions entre les espaces.

**Phase 3 — Intégration graphique**

Amélioration des modèles 3D, de l'éclairage, des matériaux, des identités visuelles et des animations.

**Phase 4 — Contenu professionnel**

Intégration du profil, du CV, de Veolia et des projets majeurs lorsqu'ils seront prêts.

**Phase 5 — Optimisation et publication**

Adaptation mobile, tests de performance, contrôles d'accessibilité et déploiement.

## 12. Critères de validation de la V1
La première version sera considérée comme fonctionnelle lorsque :

- Le campus s'affichera correctement dans le navigateur.
- Le personnage pourra se déplacer librement.
- Les six bâtiments seront présents et identifiables.
- Le visiteur pourra rejoindre chacun d'eux.
- Chaque bâtiment permettra de consulter au moins un écran interactif.
- Le visiteur pourra revenir au campus.
- Une navigation simplifiée sera disponible sur mobile.
- Les contenus pourront être remplacés directement dans le code.
- Le site pourra être publié et consulté avec une URL publique.
Les projets majeurs pourront encore contenir des données fictives ou des contenus provisoires lors de cette validation.

## 13. Références visuelles et inspirations

Ces références orientent la direction artistique et l'expérience utilisateur. Elles ne doivent pas être copiées : aucun modèle, ressource ou code ne sera repris.

### Bruno Simon
[https://bruno-simon.com/](https://bruno-simon.com/)

- Inspiration principale pour l'univers 3D stylisé.
- Caméra légèrement surélevée.
- Sensation de liberté dans l'exploration.
- Animations fluides et interactions naturelles.

### SIT Virtual Campus
[https://www.singaporetech.edu.sg/virtual-campus-tour/](https://www.singaporetech.edu.sg/virtual-campus-tour/)

- Inspiration pour l'architecture du campus.
- Bâtiments modernes et cohérents.
- Espaces verts, chemins et organisation de l'environnement.
- Ambiance professionnelle et réaliste, mais stylisée.

### Landfall
[https://landfall.framer.website/](https://landfall.framer.website/)

- Inspiration pour l'organisation des destinations.
- Chaque bâtiment représente une section du portfolio.
- Navigation simple entre les bâtiments.

### Henry Heffernan
[https://henryheffernan.com/](https://henryheffernan.com/)

- Inspiration pour les futurs écrans interactifs.
- Présentation des informations professionnelles dans un environnement 3D.
- Possibilité d'ouvrir des interfaces lisibles pour consulter les contenus.

### Foliofarer
[https://foliofarer.netlify.app/](https://foliofarer.netlify.app/)

- Inspiration pour la navigation rapide.
- Carte et accès direct aux destinations.
- Alternative de navigation simplifiée.

### Jesse's Ramen
[https://www.jesse-zhou.com/](https://www.jesse-zhou.com/)

- Inspiration pour les finitions graphiques.
- Cohérence des matériaux.
- Qualité des petits éléments décoratifs.
- Travail de l'éclairage et de l'ambiance.