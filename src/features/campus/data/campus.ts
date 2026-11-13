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
    position: [-9, 0, -9],
    color: '#dce7ed',
    accent: '#48c8da',
    size: [6.2, 4.8, 6],
  },
  {
    id: 'project-one',
    name: 'Projet majeur 1',
    shortName: '02 · PROJET 01',
    position: [0, 0, -13],
    color: '#e5e9ec',
    accent: '#84a9c1',
    size: [7.1, 5.2, 5.8],
  },
  {
    id: 'project-two',
    name: 'Projet majeur 2',
    shortName: '03 · PROJET 02',
    position: [9, 0, -9],
    color: '#dce7ed',
    accent: '#59b8c5',
    size: [6.2, 4.8, 6],
  },
  {
    id: 'project-three',
    name: 'Projet majeur 3',
    shortName: '04 · PROJET 03',
    position: [9, 0, 9],
    color: '#e5e9ec',
    accent: '#7fa0bd',
    size: [6.7, 5, 6],
  },
  {
    id: 'missions',
    name: 'Autres missions',
    shortName: '05 · MISSIONS',
    position: [0, 0, 13],
    color: '#dce7ed',
    accent: '#54becb',
    size: [7.1, 4.8, 5.8],
  },
  {
    id: 'veolia',
    name: 'Veolia',
    shortName: '06 · VEOLIA',
    position: [-9, 0, 9],
    color: '#e5e9ec',
    accent: '#52b9bb',
    size: [6.2, 5, 6],
  },
]

export const CAMPUS_LIMIT = 22
export const PLAYER_SPEED = 6
export const INTERACTION_DISTANCE = 3.2

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
