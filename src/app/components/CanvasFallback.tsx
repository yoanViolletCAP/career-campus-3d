import { useEffect } from 'react'
import DestinationList from '../../features/navigation/DestinationList'
import type { CampusBuilding } from '../../features/campus/data/campus'

export default function CanvasFallback({
  onNavigate,
  onUnavailable,
}: {
  onNavigate: (building: CampusBuilding) => void
  onUnavailable: () => void
}) {
  useEffect(() => {
    onUnavailable()
  }, [onUnavailable])

  return (
    <div className="canvas-fallback" role="status">
      <div className="canvas-fallback__content">
        <span className="eyebrow">CAREERVERSE · MODE ACCESSIBLE</span>
        <h1>Le campus 3D n’est pas disponible sur ce navigateur.</h1>
        <p>Vous pouvez tout de même accéder aux espaces du portfolio :</p>
        <DestinationList onNavigate={onNavigate} />
      </div>
    </div>
  )
}
