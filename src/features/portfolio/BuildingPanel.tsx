import type { CampusBuilding } from '../campus/data/campus'
import { portfolioContent } from './data/content'

type BuildingPanelProps = {
  building: CampusBuilding
  onClose: () => void
}

export default function BuildingPanel({ building, onClose }: BuildingPanelProps) {
  const content = portfolioContent[building.id]
  const projectSections = content.projectCaseStudy
    ? [
        { id: 'context', title: 'Contexte', body: content.projectCaseStudy.context },
        { id: 'problem', title: 'Problématique', body: content.projectCaseStudy.problem },
        { id: 'approach', title: 'Démarche', body: content.projectCaseStudy.approach },
        { id: 'realization', title: 'Réalisation', body: content.projectCaseStudy.realization },
        { id: 'results', title: 'Résultats', body: content.projectCaseStudy.results },
      ]
    : []

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="building-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="building-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="panel-close"
          onClick={onClose}
          aria-label="Fermer le panneau"
          autoFocus
        >
          ×
        </button>
        <span className="demo-badge">EXEMPLE FICTIF · DÉMONSTRATION</span>
        <span className="eyebrow">{building.shortName} · ESPACE À DÉCOUVRIR</span>
        <h2 id="building-title">{building.name}</h2>
        <p>{content.summary}</p>
        {[...content.sections, ...projectSections].map((section) => (
          <div className="portfolio-section" key={section.id}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </div>
        ))}
        {content.projectCaseStudy && content.projectCaseStudy.skills.length > 0 && (
          <div className="portfolio-section">
            <h3>Compétences mobilisées</h3>
            <ul className="portfolio-skills">
              {content.projectCaseStudy.skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        )}
        {content.missions?.map((mission) => (
          <div className="portfolio-section" key={mission.title}>
            <h3>{mission.title}</h3>
            <p>{mission.summary}</p>
            <ul className="portfolio-skills">
              {mission.skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        ))}
        {content.isDemo && (
          <div className="panel-note">
            <span className="panel-note__dot" />
            Ces informations sont générées et fictives. Elles servent uniquement à prévisualiser le portfolio.
          </div>
        )}
        <button className="panel-return" onClick={onClose}>
          Reprendre l’exploration <span aria-hidden="true">↗</span>
        </button>
      </section>
    </div>
  )
}
