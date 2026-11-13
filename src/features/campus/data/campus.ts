export type CampusBuildingId =
  | 'profile'
  | 'project-one'
  | 'project-two'
  | 'project-three'
  | 'missions'
  | 'veolia'

export type CampusBuilding = {
  id: CampusBuildingId
  name: string
  shortName: string
  position: [number, number, number]
  color: string
  accent: string
  size: [number, number, number]
  facadeStyle: 'atrium' | 'grid' | 'terrace'
}

export type CampusNavigationRequest = {
  id: number
  position: [number, number, number]
}

export const campusBuildings: CampusBuilding[] = [
  {
    id: 'profile',
    name: 'Profil',
    shortName: '01 · PROFIL',
    position: [-26, 0, -26],
    color: '#eee6d8',
    accent: '#63aaa0',
    size: [11, 6.6, 9.5],
    facadeStyle: 'atrium',
  },
  {
    id: 'project-one',
    name: 'Projet majeur 1',
    shortName: '02 · PROJET 01',
    position: [0, 0, -36],
    color: '#eadfcf',
    accent: '#78959a',
    size: [13.5, 7, 9.5],
    facadeStyle: 'grid',
  },
  {
    id: 'project-two',
    name: 'Projet majeur 2',
    shortName: '03 · PROJET 02',
    position: [26, 0, -26],
    color: '#ece8dc',
    accent: '#829477',
    size: [11, 6.6, 10.5],
    facadeStyle: 'terrace',
  },
  {
    id: 'project-three',
    name: 'Projet majeur 3',
    shortName: '04 · PROJET 03',
    position: [26, 0, 26],
    color: '#e9ddca',
    accent: '#b3946b',
    size: [12, 7, 9.5],
    facadeStyle: 'grid',
  },
  {
    id: 'missions',
    name: 'Autres missions',
    shortName: '05 · MISSIONS',
    position: [0, 0, 36],
    color: '#eee5d3',
    accent: '#879572',
    size: [12, 6.4, 9],
    facadeStyle: 'terrace',
  },
  {
    id: 'veolia',
    name: 'Veolia',
    shortName: '06 · VEOLIA',
    position: [-26, 0, 26],
    color: '#eee8d8',
    accent: '#5eaa91',
    size: [12, 8, 10],
    facadeStyle: 'atrium',
  },
]

export const CAMPUS_LIMIT = 55
export const PLAYER_SPEED = 6
export const INTERACTION_DISTANCE = 3.2

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function distanceToSegment(
  x: number,
  z: number,
  start: [number, number],
  end: [number, number],
) {
  const dx = end[0] - start[0]
  const dz = end[1] - start[1]
  const lengthSquared = dx * dx + dz * dz
  const amount = lengthSquared === 0
    ? 0
    : Math.max(0, Math.min(1, ((x - start[0]) * dx + (z - start[1]) * dz) / lengthSquared))
  return Math.hypot(x - (start[0] + dx * amount), z - (start[1] + dz * amount))
}

export function getCampusTerrainHeight(x: number, z: number, buildings: CampusBuilding[]) {
  const radius = Math.hypot(x, z)
  let flattening = smoothstep(8, 18, radius)

  for (const building of buildings) {
    const [buildingX, , buildingZ] = building.position
    const buildingRadius = Math.max(building.size[0], building.size[2]) / 2 + 1.5
    const distance = Math.hypot(x - buildingX, z - buildingZ)
    flattening = Math.min(flattening, smoothstep(buildingRadius, buildingRadius + 5, distance))

    const entrance = getEntrancePosition(building)
    const pathDistance = distanceToSegment(x, z, [0, 0], [entrance[0], entrance[2]])
    flattening = Math.min(flattening, smoothstep(2.7, 5.2, pathDistance))
  }

  const edgeFade = 1 - smoothstep(52, 59, radius)
  const reliefFade = smoothstep(8, 19, radius) * edgeFade * flattening
  const rolling =
    Math.sin(x * 0.09 + z * 0.047) * 0.44 +
    Math.cos(z * 0.105 - x * 0.052) * 0.34 +
    Math.sin((x + z) * 0.055) * 0.22
  const mounds =
    Math.exp(-((x - 43) ** 2 + (z - 4) ** 2) / 170) * 0.72 +
    Math.exp(-((x + 42) ** 2 + (z + 6) ** 2) / 190) * 0.66 +
    Math.exp(-((x - 5) ** 2 + (z + 47) ** 2) / 210) * 0.74 +
    Math.exp(-((x + 8) ** 2 + (z - 45) ** 2) / 190) * 0.62

  return -0.12 + (rolling + mounds) * reliefFade
}

export function getBuildingRotation(building: CampusBuilding): number {
  const [x, , z] = building.position
  return Math.atan2(-x, -z)
}

export function getEntrancePosition(building: CampusBuilding): [number, number, number] {
  const [x, , z] = building.position
  const rotation = getBuildingRotation(building)
  const distance = building.size[2] / 2 + 1.8
  return [x + Math.sin(rotation) * distance, 0, z + Math.cos(rotation) * distance]
}
