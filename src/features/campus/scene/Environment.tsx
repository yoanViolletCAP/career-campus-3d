import { getEntrancePosition, type CampusBuilding } from '../data/campus'

function Tree({
  position,
  scale = 1,
  tone = 0,
}: {
  position: [number, number, number]
  scale?: number
  tone?: number
}) {
  const foliage = tone % 2 === 0 ? '#527d69' : '#638774'
  const highlight = tone % 2 === 0 ? '#72947a' : '#86a084'

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[0.95, 1.15, 0.18, 10]} />
        <meshStandardMaterial color="#9b9a7a" roughness={1} />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.38, 2.9, 7]} />
        <meshStandardMaterial color="#745f4c" roughness={0.96} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.42, 2.25, 0]}
          rotation={[0, 0, side * -0.5]}
          castShadow
        >
          <cylinderGeometry args={[0.11, 0.18, 1.45, 6]} />
          <meshStandardMaterial color="#806951" roughness={0.96} />
        </mesh>
      ))}
      <mesh position={[0, 3.45, 0]} castShadow>
        <icosahedronGeometry args={[1.65, 1]} />
        <meshStandardMaterial color={foliage} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-0.82, 3.16, 0.1]} castShadow>
        <icosahedronGeometry args={[1.04, 0]} />
        <meshStandardMaterial color={highlight} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.78, 3.95, -0.12]} castShadow>
        <icosahedronGeometry args={[1.08, 0]} />
        <meshStandardMaterial color={foliage} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.12, 4.65, 0.08]} castShadow>
        <icosahedronGeometry args={[0.82, 0]} />
        <meshStandardMaterial color={highlight} roughness={0.95} flatShading />
      </mesh>
    </group>
  )
}

function FlowerBed({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[1.15, 1.08, 0.28, 12]} />
        <meshStandardMaterial color="#b9c4bb" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.08, 12]} />
        <meshStandardMaterial color="#685b4c" roughness={1} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => {
        const angle = (index / 7) * Math.PI * 2
        const x = Math.cos(angle) * 0.62
        const z = Math.sin(angle) * 0.62
        const petal = index % 2 === 0 ? '#d9c8a4' : '#91b2a1'

        return (
          <group key={index} position={[x, 0.35, z]}>
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.04, 0.42, 5]} />
              <meshStandardMaterial color="#587b66" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.44, 0]} castShadow>
              <dodecahedronGeometry args={[0.14, 0]} />
              <meshStandardMaterial color={petal} roughness={0.78} flatShading />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 0.55, 0]} castShadow>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial color="#607e65" roughness={0.96} flatShading />
      </mesh>
    </group>
  )
}

function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[2.8, 0.16, 0.72]} />
        <meshStandardMaterial color="#9a8064" roughness={0.86} />
      </mesh>
      {[-0.82, 0, 0.82].map((x) => (
        <mesh key={`seat-${x}`} position={[x, 0.72, 0]}>
          <boxGeometry args={[0.035, 0.035, 0.68]} />
          <meshStandardMaterial color="#c0a184" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 1.12, -0.28]} castShadow>
        <boxGeometry args={[2.8, 0.82, 0.12]} />
        <meshStandardMaterial color="#846d57" roughness={0.88} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`leg-${side}`} position={[side * 1.08, 0.3, 0]} castShadow>
          <boxGeometry args={[0.12, 0.6, 0.56]} />
          <meshStandardMaterial color="#3b5560" metalness={0.32} roughness={0.55} />
        </mesh>
      ))}
    </group>
  )
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.15, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.12, 4.3, 8]} />
        <meshStandardMaterial color="#3b535b" metalness={0.42} roughness={0.52} />
      </mesh>
      <mesh position={[0, 4.38, 0]} castShadow>
        <boxGeometry args={[0.52, 0.3, 0.52]} />
        <meshStandardMaterial color="#e2ece4" emissive="#a4cdbf" emissiveIntensity={0.35} roughness={0.32} />
      </mesh>
      <mesh position={[0, 4.21, 0]}>
        <boxGeometry args={[0.36, 0.06, 0.36]} />
        <meshStandardMaterial color="#82c5c6" emissive="#66aeb2" emissiveIntensity={0.45} />
      </mesh>
    </group>
  )
}

function PathToBuilding({ building }: { building: CampusBuilding }) {
  const [x, , z] = getEntrancePosition(building)
  const radius = Math.hypot(x, z)
  const plazaRadius = 6.7
  const length = Math.max(radius - plazaRadius, 0)
  const rotation = Math.atan2(x, z)
  const midpointRadius = plazaRadius + length / 2
  const joints = Math.floor(length / 3.2)

  if (length <= 0) return null

  return (
    <group
      position={[(x / radius) * midpointRadius, 0.075, (z / radius) * midpointRadius]}
      rotation={[0, rotation, 0]}
    >
      <mesh receiveShadow>
        <boxGeometry args={[4.2, 0.16, length]} />
        <meshStandardMaterial color="#cbd3d0" roughness={0.96} />
      </mesh>
      <mesh position={[0, 0.085, 0]} receiveShadow>
        <boxGeometry args={[3.55, 0.035, length - 0.12]} />
        <meshStandardMaterial color="#d9ded8" roughness={0.94} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.97, 0.08, 0]} receiveShadow>
          <boxGeometry args={[0.16, 0.14, length]} />
          <meshStandardMaterial color="#aebdb6" roughness={0.88} />
        </mesh>
      ))}
      {Array.from({ length: joints }, (_, index) => {
        const segmentZ = -length / 2 + (index + 1) * (length / (joints + 1))
        return (
          <mesh key={index} position={[0, 0.11, segmentZ]}>
            <boxGeometry args={[3.48, 0.016, 0.045]} />
            <meshStandardMaterial color="#b6c3be" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

function WelcomePlaza() {
  const gardenAngles = [Math.PI / 8, (3 * Math.PI) / 8, (5 * Math.PI) / 8, (7 * Math.PI) / 8,
    (9 * Math.PI) / 8, (11 * Math.PI) / 8, (13 * Math.PI) / 8, (15 * Math.PI) / 8]

  return (
    <group>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[7.2, 7.2, 0.22, 64]} />
        <meshStandardMaterial color="#d8ded8" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[5.85, 5.85, 0.045, 64]} />
        <meshStandardMaterial color="#c5cfca" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <torusGeometry args={[6.75, 0.09, 8, 72]} />
        <meshStandardMaterial color="#99aaa3" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.05, -0.4]} receiveShadow>
        <cylinderGeometry args={[1.75, 1.85, 0.32, 16]} />
        <meshStandardMaterial color="#9eaaa5" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.24, -0.4]}>
        <cylinderGeometry args={[1.48, 1.48, 0.12, 24]} />
        <meshStandardMaterial color="#7ab5b5" metalness={0.16} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.67, -0.4]} castShadow>
        <cylinderGeometry args={[0.24, 0.38, 0.8, 8]} />
        <meshStandardMaterial color="#738780" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.16, -0.4]} castShadow>
        <octahedronGeometry args={[0.38, 1]} />
        <meshStandardMaterial color="#80bdb9" metalness={0.18} roughness={0.34} flatShading />
      </mesh>
      {gardenAngles.map((angle, index) => {
        const radius = 8.7
        const position: [number, number, number] = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
        return <FlowerBed key={index} position={position} rotation={angle} />
      })}
      {gardenAngles.filter((_, index) => index % 2 === 0).map((angle, index) => {
        const radius = 5.9
        const position: [number, number, number] = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
        return <Lamp key={`plaza-lamp-${index}`} position={position} />
      })}
      <Bench position={[-8.8, 0, -1.7]} rotation={Math.PI / 2} />
      <Bench position={[8.8, 0, -1.7]} rotation={-Math.PI / 2} />
      <Bench position={[-5.7, 0, 7.1]} rotation={0.72} />
      <Bench position={[5.7, 0, 7.1]} rotation={-0.72} />
    </group>
  )
}

export default function Environment({ buildings }: { buildings: CampusBuilding[] }) {
  const trees: [number, number, number][] = Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2 + Math.PI / 18
    const radius = index % 2 === 0 ? 48 : 52
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
  })

  const pathLandscaping = buildings.flatMap((building) => {
    const [x, , z] = building.position
    const radius = Math.hypot(x, z)
    const directionX = x / radius
    const directionZ = z / radius
    const tangentX = -directionZ
    const tangentZ = directionX
    return [15, 25].map((distance, index) => ({
      position: [
        directionX * distance + tangentX * 4.1,
        0,
        directionZ * distance + tangentZ * 4.1,
      ] as [number, number, number],
      scale: index === 0 ? 0.82 : 0.68,
    }))
  })
  const pathLamps = buildings.map((building) => {
    const [x, , z] = building.position
    const radius = Math.hypot(x, z)
    const directionX = x / radius
    const directionZ = z / radius
    const tangentX = -directionZ
    const tangentZ = directionX
    return [
      directionX * 19 + tangentX * 3.2,
      0,
      directionZ * 19 + tangentZ * 3.2,
    ] as [number, number, number]
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]} receiveShadow>
        <planeGeometry args={[128, 128]} />
        <meshStandardMaterial color="#788f7e" roughness={1} />
      </mesh>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[58, 60, 0.18, 64]} />
        <meshStandardMaterial color="#829984" roughness={1} />
      </mesh>
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2
        const radius = 40
        return (
          <mesh
            key={`meadow-${index}`}
            position={[Math.cos(angle) * radius, 0.062, Math.sin(angle) * radius]}
            receiveShadow
          >
            <cylinderGeometry args={[3.4, 3.4, 0.025, 10]} />
            <meshStandardMaterial color={index % 2 === 0 ? '#8fa28a' : '#899b83'} roughness={1} />
          </mesh>
        )
      })}
      {buildings.map((building) => (
        <PathToBuilding key={building.id} building={building} />
      ))}
      <WelcomePlaza />
      {pathLandscaping.map((garden, index) => (
        <FlowerBed key={`path-bed-${index}`} position={garden.position} />
      ))}
      {pathLamps.map((position, index) => (
        <Lamp key={`path-lamp-${index}`} position={position} />
      ))}
      {trees.map((position, index) => (
        <Tree
          key={position.join(',')}
          position={position}
          scale={index % 3 === 0 ? 1.18 : 0.92}
          tone={index}
        />
      ))}
    </group>
  )
}
