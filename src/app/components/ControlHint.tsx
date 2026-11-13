import type { CampusBuilding } from '../../features/campus/data/campus'

export default function ControlHint({
  nearbyBuilding,
}: {
  nearbyBuilding: CampusBuilding | null
}) {
  return (
    <aside className="control-hint" aria-label="Commandes de déplacement">
      <span className="control-hint__eyebrow">SE DÉPLACER</span>
      <div className="key-row"><kbd>Z</kbd><kbd>Q</kbd><kbd>S</kbd><kbd>D</kbd><span>ou WASD</span></div>
      <div className="key-row key-row--arrows"><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd><span>pour explorer</span></div>
      {nearbyBuilding && (
        <p className="nearby-hint">
          <kbd>E</kbd> Consulter <strong>{nearbyBuilding.name}</strong>
        </p>
      )}
    </aside>
  )
}
