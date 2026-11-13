import { Html } from '@react-three/drei'
import type { CampusBuilding } from '../data/campus'
import { getBuildingRotation } from '../data/campus'

type BuildingsProps = {
  buildings: CampusBuilding[]
}

function Building({ building }: { building: CampusBuilding }) {
  const [width, height, depth] = building.size
  const rotation = getBuildingRotation(building)

  return (
    <group position={building.position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[width + 0.5, 0.24, depth + 0.5]} />
        <meshStandardMaterial color="#b4c3cd" roughness={0.75} />
      </mesh>
      <mesh position={[0, height / 2 + 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={building.color} roughness={0.78} />
      </mesh>
      <mesh position={[0, height + 0.42, 0]} castShadow>
        <boxGeometry args={[width + 0.42, 0.28, depth + 0.42]} />
        <meshStandardMaterial color="#21384a" roughness={0.62} />
      </mesh>
      <mesh position={[0, height + 0.59, 0]}>
        <boxGeometry args={[width + 0.18, 0.055, depth + 0.18]} />
        <meshStandardMaterial color="#aebdc5" roughness={0.65} metalness={0.12} />
      </mesh>
      <mesh position={[0, height + 0.58, 0]} castShadow>
        <boxGeometry args={[width * 0.76, 0.08, depth * 0.76]} />
        <meshStandardMaterial color={building.accent} roughness={0.45} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * width * 0.27, height * 0.58, depth / 2 + 0.025]}
            castShadow
          >
            <boxGeometry args={[width * 0.2, 1.35, 0.06]} />
            <meshStandardMaterial
              color="#a9d8e2"
              emissive="#44829a"
              emissiveIntensity={0.12}
              metalness={0.16}
              roughness={0.24}
            />
          </mesh>
          <mesh
            position={[side * width * 0.27, height * 0.58, depth / 2 + 0.065]}
          >
            <boxGeometry args={[width * 0.2, 0.055, 0.025]} />
            <meshStandardMaterial color="#dce8e9" metalness={0.22} roughness={0.36} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={`side-window-${side}`} position={[side * (width / 2 + 0.025), height * 0.58, 0]}>
          <boxGeometry args={[0.06, 1.35, depth * 0.2]} />
          <meshStandardMaterial
            color="#a9d8e2"
            emissive="#44829a"
            emissiveIntensity={0.12}
            metalness={0.16}
            roughness={0.24}
          />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh
          key={`facade-pier-${side}`}
          position={[side * width * 0.46, height * 0.48, depth / 2 + 0.045]}
          castShadow
        >
          <boxGeometry args={[0.14, height * 0.9, 0.13]} />
          <meshStandardMaterial color="#bdcbd1" roughness={0.72} />
        </mesh>
      ))}
      <mesh position={[0, 1.08, depth / 2 + 0.055]} castShadow>
        <boxGeometry args={[1.08, 2.16, 0.12]} />
        <meshStandardMaterial color="#17334a" roughness={0.38} />
      </mesh>
      <mesh position={[0, 1.12, depth / 2 + 0.125]}>
        <boxGeometry args={[0.76, 1.62, 0.025]} />
        <meshStandardMaterial
          color="#82bcc9"
          emissive="#315f70"
          emissiveIntensity={0.16}
          metalness={0.18}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 2.34, depth / 2 + 0.36]} castShadow>
        <boxGeometry args={[2.05, 0.14, 0.9]} />
        <meshStandardMaterial color="#d7e0e1" roughness={0.65} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={`canopy-support-${side}`}
          position={[side * 0.82, 1.19, depth / 2 + 0.48]}
          castShadow
        >
          <boxGeometry args={[0.09, 2.25, 0.1]} />
          <meshStandardMaterial color="#6e8792" metalness={0.18} roughness={0.55} />
        </mesh>
      ))}
      <mesh position={[0, 2.25, depth / 2 + 0.08]}>
        <boxGeometry args={[width * 0.72, 0.12, 0.14]} />
        <meshStandardMaterial color={building.accent} emissive={building.accent} emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, 2.83, depth / 2 + 0.09]} castShadow>
        <boxGeometry args={[1.42, 0.82, 0.16]} />
        <meshStandardMaterial color="#17374b" roughness={0.46} />
      </mesh>
      <mesh position={[0, 2.83, depth / 2 + 0.18]}>
        <boxGeometry args={[1.2, 0.58, 0.035]} />
        <meshStandardMaterial
          color="#79d3dc"
          emissive={building.accent}
          emissiveIntensity={0.42}
          metalness={0.12}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, 0.2, depth / 2 + 0.42]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.22, 0.8]} />
        <meshStandardMaterial color="#aebdc6" roughness={0.8} />
      </mesh>

      <Html position={[0, height + 1.25, 0]} center distanceFactor={17} style={{ pointerEvents: 'none' }}>
        <div className="building-label">
          <span>{building.shortName}</span>
          <strong>{building.name}</strong>
        </div>
      </Html>
    </group>
  )
}

export default function Buildings({ buildings }: BuildingsProps) {
  return (
    <group>
      {buildings.map((building) => (
        <Building key={building.id} building={building} />
      ))}
    </group>
  )
}
