import { getEntrancePosition, type CampusBuilding } from '../data/campus'

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 1.6, 6]} />
        <meshStandardMaterial color="#765d4b" roughness={1} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial color="#477867" roughness={0.92} flatShading />
      </mesh>
      <mesh position={[0.42, 2.55, -0.08]} castShadow>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial color="#638c72" roughness={0.92} flatShading />
      </mesh>
    </group>
  )
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.075, 2.4, 8]} />
        <meshStandardMaterial color="#334a59" metalness={0.45} roughness={0.48} />
      </mesh>
      <mesh position={[0, 2.48, 0]} castShadow>
        <boxGeometry args={[0.3, 0.22, 0.3]} />
        <meshStandardMaterial color="#d5f2ee" emissive="#84d8d0" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function PathToBuilding({ building }: { building: CampusBuilding }) {
  const [x, , z] = getEntrancePosition(building)
  const radius = Math.hypot(x, z)
  const plazaRadius = 4.75
  const length = Math.max(radius - plazaRadius, 0)
  const rotation = Math.atan2(x, z)
  const midpointRadius = plazaRadius + length / 2

  return length > 0 ? (
    <group
      position={[(x / radius) * midpointRadius, 0.08, (z / radius) * midpointRadius]}
      rotation={[0, rotation, 0]}
    >
      <mesh receiveShadow>
        <boxGeometry args={[2.35, 0.12, length]} />
        <meshStandardMaterial color="#c5d0d5" roughness={0.94} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.08, 0.055, 0]} receiveShadow>
          <boxGeometry args={[0.1, 0.07, length]} />
          <meshStandardMaterial color="#aebdc0" roughness={0.92} />
        </mesh>
      ))}
      {Array.from({ length: Math.floor(length / 1.6) }, (_, index) => {
        const segmentZ = -length / 2 + (index + 1) * (length / (Math.floor(length / 1.6) + 1))
        return (
          <mesh key={index} position={[0, 0.063, segmentZ]}>
            <boxGeometry args={[2.22, 0.012, 0.025]} />
            <meshStandardMaterial color="#b4c1c5" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  ) : null
}

export default function Environment({ buildings }: { buildings: CampusBuilding[] }) {
  const trees: [number, number, number][] = [
    [-17, 0, -15], [-14, 0, -18], [-5, 0, -19], [5, 0, -19], [14, 0, -17],
    [18, 0, -12], [18, 0, 1], [17, 0, 16], [11, 0, 19], [2, 0, 19],
    [-12, 0, 18], [-18, 0, 14], [-19, 0, 3], [-18, 0, -5],
  ]

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[52, 52]} />
        <meshStandardMaterial color="#829d8b" roughness={1} />
      </mesh>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[4.8, 4.8, 0.18, 48]} />
        <meshStandardMaterial color="#d4dee0" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.055, 0]} receiveShadow>
        <cylinderGeometry args={[3.55, 3.55, 0.035, 48]} />
        <meshStandardMaterial color="#becbd0" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.078, 0]} receiveShadow>
        <torusGeometry args={[4.45, 0.055, 8, 64]} />
        <meshStandardMaterial color="#aebfc2" roughness={0.78} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.075, 0]} receiveShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.025, 24]} />
        <meshStandardMaterial color="#64aeba" roughness={0.75} />
      </mesh>
      {buildings.map((building) => (
        <PathToBuilding key={building.id} building={building} />
      ))}
      {trees.map((position, index) => (
        <Tree key={position.join(',')} position={position} scale={index % 3 === 0 ? 1.12 : 0.9} />
      ))}
      {[
        [-4.6, 0, -4.6],
        [4.6, 0, -4.6],
        [4.6, 0, 4.6],
        [-4.6, 0, 4.6],
      ].map((position) => (
        <Lamp key={position.join(',')} position={position as [number, number, number]} />
      ))}
    </group>
  )
}
