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
    color: '#dce7ed',
    accent: '#48c8da',
    size: [10.5, 6.2, 9.5],
    facadeStyle: 'atrium',
  },
  {
    id: 'project-one',
    name: 'Projet majeur 1',
    shortName: '02 · PROJET 01',
    position: [0, 0, -36],
    color: '#e5e9ec',
    accent: '#84a9c1',
    size: [12, 6.8, 9],
    facadeStyle: 'grid',
  },
  {
    id: 'project-two',
    name: 'Projet majeur 2',
    shortName: '03 · PROJET 02',
    position: [26, 0, -26],
    color: '#dce7ed',
    accent: '#59b8c5',
    size: [10.5, 6.2, 9.5],
    facadeStyle: 'terrace',
  },
  {
    id: 'project-three',
    name: 'Projet majeur 3',
    shortName: '04 · PROJET 03',
    position: [26, 0, 26],
    color: '#e5e9ec',
    accent: '#7fa0bd',
    size: [11, 6.5, 9.5],
    facadeStyle: 'grid',
  },
  {
    id: 'missions',
    name: 'Autres missions',
    shortName: '05 · MISSIONS',
    position: [0, 0, 36],
    color: '#dce7ed',
    accent: '#54becb',
    size: [12, 6.2, 9],
    facadeStyle: 'terrace',
  },
  {
    id: 'veolia',
    name: 'Veolia',
    shortName: '06 · VEOLIA',
    position: [-26, 0, 26],
    color: '#e5e9ec',
    accent: '#52b9bb',
    size: [10.5, 6.5, 9.5],
    facadeStyle: 'atrium',
  },
]

export const CAMPUS_LIMIT = 55
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
