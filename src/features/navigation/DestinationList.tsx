import { campusBuildings, type CampusBuilding } from '../campus/data/campus'

export default function DestinationList({
  onNavigate,
}: {
  onNavigate: (building: CampusBuilding) => void
}) {
  return (
    <nav className="destination-list" aria-label="Navigation du campus">
      {campusBuildings.map((building, index) => (
        <button key={building.id} onClick={() => onNavigate(building)}>
          <span>0{index + 1}</span>
          {building.name}
        </button>
      ))}
    </nav>
  )
}
