import { Html } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Vector3 } from 'three'
import type { CampusBuilding } from '../data/campus'
import Buildings from './Buildings'
import Environment from './Environment'
import Player from './Player'

type CampusSceneProps = {
  buildings: CampusBuilding[]
  playerPosition: Vector3
  onNearbyChange: (building: CampusBuilding | null) => void
  onInteract: (building: CampusBuilding) => void
  onNavigate: (building: CampusBuilding) => void
  onFirstFrame: () => void
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const reported = useRef(false)

  useFrame(() => {
    if (reported.current) return
    reported.current = true
    onReady()
  })

  return null
}

function NavigationBoard({ buildings, onNavigate }: Pick<CampusSceneProps, 'buildings' | 'onNavigate'>) {
  return (
    <group>
      <mesh position={[0, 1.3, -2.6]} castShadow>
        <boxGeometry args={[3.2, 2.6, 0.2]} />
        <meshStandardMaterial color="#19364a" roughness={0.55} />
      </mesh>
      <mesh position={[0, 2.58, -2.48]}>
        <boxGeometry args={[2.92, 0.08, 0.025]} />
        <meshStandardMaterial color="#67d1db" emissive="#43aeb9" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.9, 0.08, -2.6]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.9, 8]} />
        <meshStandardMaterial color="#314d5c" roughness={0.68} />
      </mesh>
      <mesh position={[0.9, 0.08, -2.6]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.9, 8]} />
        <meshStandardMaterial color="#314d5c" roughness={0.68} />
      </mesh>
      <Html position={[0, 1.42, -2.48]} center>
        <div className="world-board" onPointerDown={(event) => event.stopPropagation()}>
          <span className="world-board__eyebrow">CAREERVERSE · CAMPUS</span>
          <strong>Choisir une destination</strong>
          <div className="world-board__destinations">
            {buildings.map((building, index) => (
              <button key={building.id} onClick={() => onNavigate(building)}>
                <span>0{index + 1}</span>
                {building.name}
                <b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>
        </div>
      </Html>
    </group>
  )
}

export default function CampusScene({
  buildings,
  playerPosition,
  onNearbyChange,
  onInteract,
  onNavigate,
  onFirstFrame,
}: CampusSceneProps) {
  return (
    <>
      <color attach="background" args={['#b9d1d8']} />
      <fog attach="fog" args={['#b9d1d8', 34, 72]} />
      <ambientLight intensity={1.25} color="#e6f1f1" />
      <directionalLight
        position={[-14, 24, 12]}
        intensity={1.9}
        color="#fff5e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.00015}
      />
      <hemisphereLight args={['#d7efff', '#526d5b', 0.55]} />
      <Environment buildings={buildings} />
      <Buildings buildings={buildings} />
      <NavigationBoard buildings={buildings} onNavigate={onNavigate} />
      <Player
        buildings={buildings}
        position={playerPosition}
        onNearbyChange={onNearbyChange}
        onInteract={onInteract}
      />
      <FirstFrame onReady={onFirstFrame} />
    </>
  )
}
