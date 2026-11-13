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
    <group position={[2.2, 0, -5.3]} rotation={[0, -Math.PI / 8, 0]}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[4.7, 3.6, 0.28]} />
        <meshStandardMaterial color="#19364a" roughness={0.55} />
      </mesh>
      <mesh position={[0, 3.55, 0.18]}>
        <boxGeometry args={[4.35, 0.1, 0.035]} />
        <meshStandardMaterial color="#67d1db" emissive="#43aeb9" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-1.45, 0.08, -0.02]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 2.9, 8]} />
        <meshStandardMaterial color="#314d5c" roughness={0.68} />
      </mesh>
      <mesh position={[1.45, 0.08, -0.02]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 2.9, 8]} />
        <meshStandardMaterial color="#314d5c" roughness={0.68} />
      </mesh>
      <Html position={[0, 1.82, 0.19]} center>
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
      <color attach="background" args={['#cbd6c8']} />
      <fog attach="fog" args={['#cbd6c8', 112, 205]} />
      <ambientLight intensity={1.15} color="#f4ead7" />
      <directionalLight
        position={[-24, 34, 20]}
        intensity={1.8}
        color="#ffe7c2"
        castShadow
        shadow-mapSize-width={1536}
        shadow-mapSize-height={1536}
        shadow-camera-left={-92}
        shadow-camera-right={92}
        shadow-camera-top={92}
        shadow-camera-bottom={-92}
        shadow-bias={-0.00015}
      />
      <hemisphereLight args={['#e3e7d4', '#655c43', 0.72]} />
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
