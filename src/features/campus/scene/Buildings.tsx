import { Html } from '@react-three/drei'
import type { CampusBuilding } from '../data/campus'
import { getBuildingRotation } from '../data/campus'

type BuildingsProps = {
  buildings: CampusBuilding[]
}

function EntrancePlanter({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.8, 0.95]} />
        <meshStandardMaterial color="#c3cec6" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.84, 0]} castShadow>
        <dodecahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial color="#66856e" roughness={0.94} flatShading />
      </mesh>
      <mesh position={[0.2, 1.04, 0.08]} castShadow>
        <icosahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial color="#86a184" roughness={0.94} flatShading />
      </mesh>
      <mesh position={[-0.22, 0.98, -0.08]} castShadow>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color="#557966" roughness={0.94} flatShading />
      </mesh>
    </group>
  )
}

function Building({ building }: { building: CampusBuilding }) {
  const [width, height, depth] = building.size
  const rotation = getBuildingRotation(building)
  const doorHeight = Math.min(height * 0.53, 3.25)
  const windowHeight = height * 0.22
  const windowRows = [height * 0.47, height * 0.77]
  const facadeColumns = [-1, 0, 1]

  return (
    <group position={building.position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <boxGeometry args={[width + 1.15, 0.28, depth + 1.15]} />
        <meshStandardMaterial color="#aebdb8" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.72, 0.12, depth + 0.72]} />
        <meshStandardMaterial color="#e2e4dc" roughness={0.82} />
      </mesh>
      <mesh position={[0, height / 2 + 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={building.color} roughness={0.82} />
      </mesh>

      <mesh position={[0, height * 0.35 + 0.38, depth / 2 + 0.036]}>
        <boxGeometry args={[width - 0.48, 0.12, 0.08]} />
        <meshStandardMaterial color="#c0ccc8" roughness={0.75} />
      </mesh>
      <mesh position={[0, height * 0.66 + 0.38, depth / 2 + 0.036]}>
        <boxGeometry args={[width - 0.48, 0.11, 0.08]} />
        <meshStandardMaterial color="#c0ccc8" roughness={0.75} />
      </mesh>

      {windowRows.map((rowY, row) =>
        facadeColumns.map((column) => {
          if (row === 0 && column === 0) return null
          const x = column * width * 0.29
          return (
            <group key={`front-window-${row}-${column}`}>
              <mesh position={[x, rowY + 0.38, depth / 2 + 0.07]} castShadow>
                <boxGeometry args={[width * 0.2, windowHeight, 0.1]} />
                <meshStandardMaterial
                  color="#8fb9c1"
                  emissive={building.accent}
                  emissiveIntensity={0.045}
                  metalness={0.2}
                  roughness={0.28}
                />
              </mesh>
              <mesh position={[x, rowY + 0.38, depth / 2 + 0.13]}>
                <boxGeometry args={[0.055, windowHeight, 0.035]} />
                <meshStandardMaterial color="#dce4df" metalness={0.16} roughness={0.52} />
              </mesh>
              <mesh position={[x, rowY + 0.38, depth / 2 + 0.14]}>
                <boxGeometry args={[width * 0.2, 0.055, 0.035]} />
                <meshStandardMaterial color="#dce4df" metalness={0.16} roughness={0.52} />
              </mesh>
            </group>
          )
        }),
      )}

      {[-1, 1].map((side) => (
        <group key={`side-${side}`}>
          {[-1, 0, 1].map((column) => (
            <mesh
              key={column}
              position={[side * (width / 2 + 0.035), height * 0.68, column * depth * 0.27]}
            >
              <boxGeometry args={[0.07, 1.22, depth * 0.19]} />
              <meshStandardMaterial
                color="#91b9c1"
                emissive={building.accent}
                emissiveIntensity={0.035}
                metalness={0.18}
                roughness={0.32}
              />
            </mesh>
          ))}
          <mesh position={[side * (width / 2 + 0.09), height * 0.49, 0]} castShadow>
            <boxGeometry args={[0.16, height * 0.94, 0.18]} />
            <meshStandardMaterial color="#c8d1cb" roughness={0.76} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, doorHeight / 2 + 0.38, depth / 2 + 0.09]} castShadow>
        <boxGeometry args={[1.65, doorHeight, 0.2]} />
        <meshStandardMaterial color="#19364a" roughness={0.42} />
      </mesh>
      <mesh position={[0, doorHeight / 2 + 0.38, depth / 2 + 0.205]}>
        <boxGeometry args={[1.3, doorHeight - 0.22, 0.055]} />
        <meshStandardMaterial
          color="#76aeb8"
          emissive={building.accent}
          emissiveIntensity={0.09}
          metalness={0.22}
          roughness={0.26}
        />
      </mesh>
      <mesh position={[0.48, doorHeight / 2 + 0.38, depth / 2 + 0.25]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial color="#d9c9a8" metalness={0.62} roughness={0.28} />
      </mesh>

      <mesh position={[0, doorHeight + 0.55, depth / 2 + 0.46]} castShadow>
        <boxGeometry args={[2.75, 0.18, 1.18]} />
        <meshStandardMaterial color="#e0e5df" roughness={0.65} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={`canopy-pillar-${side}`}
          position={[side * 1.1, (doorHeight + 0.38) / 2, depth / 2 + 0.76]}
          castShadow
        >
          <boxGeometry args={[0.14, doorHeight + 0.38, 0.15]} />
          <meshStandardMaterial color="#849a97" metalness={0.16} roughness={0.56} />
        </mesh>
      ))}
      <mesh position={[0, doorHeight + 0.4, depth / 2 + 0.35]}>
        <boxGeometry args={[2.25, 0.09, 0.16]} />
        <meshStandardMaterial color={building.accent} emissive={building.accent} emissiveIntensity={0.18} />
      </mesh>

      <mesh position={[0, height - 0.54, depth / 2 + 0.105]} castShadow>
        <boxGeometry args={[width * 0.56, 0.58, 0.18]} />
        <meshStandardMaterial color="#18364a" roughness={0.55} />
      </mesh>
      <mesh position={[0, height - 0.54, depth / 2 + 0.205]}>
        <boxGeometry args={[width * 0.48, 0.075, 0.035]} />
        <meshStandardMaterial color={building.accent} emissive={building.accent} emissiveIntensity={0.3} />
      </mesh>

      {building.facadeStyle === 'atrium' && (
        <group>
          <mesh position={[0, height * 0.52 + 0.38, depth / 2 + 0.015]}>
            <boxGeometry args={[width * 0.82, height * 0.055, 0.07]} />
            <meshStandardMaterial color={building.accent} roughness={0.5} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * width * 0.39, height * 0.5 + 0.38, depth / 2 + 0.06]}>
              <boxGeometry args={[0.12, height * 0.9, 0.1]} />
              <meshStandardMaterial color="#c3d0ca" roughness={0.62} />
            </mesh>
          ))}
        </group>
      )}
      {building.facadeStyle === 'grid' && (
        <group>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * width * 0.39, height * 0.63 + 0.38, depth / 2 + 0.12]}>
              <boxGeometry args={[0.09, height * 0.48, 0.08]} />
              <meshStandardMaterial color="#b4c3bf" metalness={0.14} roughness={0.56} />
            </mesh>
          ))}
        </group>
      )}
      {building.facadeStyle === 'terrace' && (
        <group>
          {[-1, 0, 1].map((index) => (
            <mesh key={index} position={[0, height * 0.66 + 0.38 + index * 0.28, depth / 2 + 0.14]}>
              <boxGeometry args={[width * 0.72, 0.075, 0.3]} />
              <meshStandardMaterial color="#a7b9b2" roughness={0.66} />
            </mesh>
          ))}
        </group>
      )}
      <EntrancePlanter x={-width * 0.29} z={depth / 2 + 0.58} />
      <EntrancePlanter x={width * 0.29} z={depth / 2 + 0.58} />

      <mesh position={[0, height + 0.48, 0]} castShadow>
        <boxGeometry args={[width + 0.62, 0.38, depth + 0.62]} />
        <meshStandardMaterial color="#263f4c" roughness={0.62} />
      </mesh>
      <mesh position={[0, height + 0.7, 0]}>
        <boxGeometry args={[width + 0.28, 0.08, depth + 0.28]} />
        <meshStandardMaterial color="#c4ceca" metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh position={[0, height + 0.77, 0]} castShadow>
        <boxGeometry args={[width * 0.73, 0.12, depth * 0.72]} />
        <meshStandardMaterial color={building.accent} roughness={0.48} />
      </mesh>
      <mesh position={[0, height + 0.88, 0]} castShadow>
        <boxGeometry args={[width * 0.34, 0.16, depth * 0.25]} />
        <meshStandardMaterial
          color="#9dc5c5"
          emissive={building.accent}
          emissiveIntensity={0.12}
          metalness={0.18}
          roughness={0.3}
        />
      </mesh>
      {[-1, 0, 1].map((side) => (
        <mesh key={`solar-${side}`} position={[side * width * 0.27, height + 0.86, -depth * 0.25]}>
          <boxGeometry args={[width * 0.17, 0.035, depth * 0.2]} />
          <meshStandardMaterial color="#304b5a" metalness={0.45} roughness={0.38} />
        </mesh>
      ))}

      <Html position={[0, height + 1.6, 0]} center distanceFactor={23} style={{ pointerEvents: 'none' }}>
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
