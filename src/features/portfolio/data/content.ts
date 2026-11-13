import type { CampusBuildingId } from '../../campus/data/campus'

export type PortfolioSection = {
  id: string
  title: string
  body: string
}

export type ProjectCaseStudy = {
  context: string
  problem: string
  approach: string
  realization: string
  results: string
  skills: string[]
}

export type PortfolioMission = {
  title: string
  summary: string
  skills: string[]
}

export type PortfolioPageContent = {
  summary: string
  sections: PortfolioSection[]
  projectCaseStudy?: ProjectCaseStudy
  missions?: PortfolioMission[]
  isDemo: boolean
}

export const portfolioContent: Record<CampusBuildingId, PortfolioPageContent> = {
  profile: {
    summary: 'Alex Martin est un profil fictif de développeur web junior, attiré par les produits numériques utiles et les expériences interactives.',
    sections: [
      {
        id: 'profile',
        title: 'Profil',
        body: 'Curieux et méthodique, Alex aime transformer un besoin concret en interface claire, accessible et agréable à utiliser.',
      },
      {
        id: 'journey',
        title: 'Parcours',
        body: 'Exemple de parcours : formation en développement web, puis alternance au sein d’une équipe produit pluridisciplinaire.',
      },
      {
        id: 'skills',
        title: 'Compétences',
        body: 'React, TypeScript, conception d’interfaces, prototypage, intégration web et travail en équipe agile.',
      },
      {
        id: 'cv',
        title: 'CV',
        body: 'Un lien vers le CV réel pourra être ajouté ici lorsque les informations définitives seront prêtes.',
      },
    ],
    isDemo: true,
  },
  'project-one': {
    summary: 'Prototype fictif d’un tableau de bord pour comprendre et comparer la consommation énergétique de plusieurs bâtiments.',
    projectCaseStudy: {
      context: 'Scénario de démonstration : une équipe de campus souhaite mieux comprendre les consommations de ses bâtiments.',
      problem: 'Les relevés sont dispersés et difficiles à comparer ; repérer une variation demande plusieurs manipulations.',
      approach: 'Rassembler les indicateurs essentiels, clarifier les unités et proposer des filtres par bâtiment et période.',
      realization: 'Création d’un tableau de bord responsive avec synthèse, graphiques et états vides documentés.',
      results: 'Le prototype rend les écarts plus faciles à repérer sur un jeu de données entièrement synthétique.',
      skills: ['React', 'TypeScript', 'Data visualisation', 'UX'],
    },
    sections: [],
    isDemo: true,
  },
  'project-two': {
    summary: 'Exemple fictif d’une application qui accompagne le suivi d’interventions de la demande à sa résolution.',
    projectCaseStudy: {
      context: 'Scénario de démonstration : les équipes d’un site veulent partager un suivi simple des demandes de maintenance.',
      problem: 'Les demandes arrivent par plusieurs canaux et leur statut n’est pas toujours visible par les personnes concernées.',
      approach: 'Structurer le parcours autour de trois étapes compréhensibles : signaler, suivre et clôturer.',
      realization: 'Conception d’un prototype mobile avec formulaire guidé, liste filtrable et historique de statut.',
      results: 'Le parcours de démonstration regroupe les informations utiles dans un espace unique et lisible.',
      skills: ['React', 'Accessibilité', 'Prototypage', 'Design system'],
    },
    sections: [],
    isDemo: true,
  },
  'project-three': {
    summary: 'Concept fictif d’une visualisation 3D légère pour explorer les équipements et leurs informations de maintenance.',
    projectCaseStudy: {
      context: 'Scénario de démonstration : rendre les équipements d’un atelier plus faciles à localiser et à comprendre.',
      problem: 'Une liste seule donne peu de repères spatiaux et oblige à connaître les noms exacts des équipements.',
      approach: 'Associer une vue d’ensemble simplifiée à des fiches d’information accessibles hors de la scène 3D.',
      realization: 'Prototype d’une scène WebGL avec repères sélectionnables, panneau de détail et navigation clavier.',
      results: 'La démonstration illustre une exploration spatiale sans faire dépendre la lecture des informations de la 3D.',
      skills: ['Three.js', 'React Three Fiber', 'Interaction 3D', 'Performance'],
    },
    sections: [],
    isDemo: true,
  },
  missions: {
    summary: 'Exemples fictifs de contributions transverses menées au fil d’un projet numérique.',
    sections: [],
    missions: [
      {
        title: 'Mise en place d’un système de composants',
        summary: 'Uniformiser boutons, formulaires et états d’interface pour accélérer les évolutions.',
        skills: ['React', 'CSS', 'Documentation'],
      },
      {
        title: 'Amélioration de l’accessibilité',
        summary: 'Revoir la navigation clavier, les libellés et les contrastes sur plusieurs écrans.',
        skills: ['Accessibilité', 'Audit UI', 'HTML sémantique'],
      },
      {
        title: 'Automatisation de contrôles',
        summary: 'Ajouter des vérifications TypeScript et build à la routine de livraison.',
        skills: ['TypeScript', 'Vite', 'Qualité'],
      },
    ],
    isDemo: true,
  },
  veolia: {
    summary: 'Exemples fictifs de missions présentés pour illustrer la future organisation de cet espace. Ils ne décrivent pas une expérience réelle.',
    sections: [],
    missions: [
      {
        title: 'Suivi des consommations d’eau',
        summary: 'Scénario fictif : concevoir une synthèse par site, période et catégorie de consommation.',
        skills: ['Analyse de données', 'Tableau de bord', 'UX'],
      },
      {
        title: 'Signalement terrain',
        summary: 'Scénario fictif : simplifier la remontée d’une observation depuis un téléphone.',
        skills: ['Conception mobile', 'Formulaires', 'Accessibilité'],
      },
      {
        title: 'Indicateurs de mission',
        summary: 'Scénario fictif : mettre en forme des indicateurs de suivi dans une interface lisible.',
        skills: ['Visualisation', 'Synthèse', 'Interface web'],
      },
    ],
    isDemo: true,
  },
}
