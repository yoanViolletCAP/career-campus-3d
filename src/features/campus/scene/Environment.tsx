import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import { getCampusTerrainHeight, getEntrancePosition, type CampusBuilding } from '../data/campus'

type InstanceTransform = {
  position: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number]
  color?: string
}

function usePopulateInstances(
  ref: RefObject<THREE.InstancedMesh | null>,
  transforms: InstanceTransform[],
) {
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return

    const object = new THREE.Object3D()
    transforms.forEach((instance, index) => {
      object.position.set(...instance.position)
      object.rotation.set(...(instance.rotation ?? [0, 0, 0]))
      object.scale.set(...(instance.scale ?? [1, 1, 1]))
      object.updateMatrix()
      mesh.setMatrixAt(index, object.matrix)
      if (instance.color) mesh.setColorAt(index, new THREE.Color(instance.color))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [ref, transforms])
}

function CampusTerrain({ buildings }: { buildings: CampusBuilding[] }) {
  const geometry = useMemo(() => {
    const segments = 96
    const size = 128
    const rowLength = segments + 1
    const vertexCount = rowLength * rowLength
    const positions = new Float32Array(vertexCount * 3)
    const colors = new Float32Array(vertexCount * 3)
    const indices: number[] = []
    const grassLow = new THREE.Color('#788b68')
    const grassHigh = new THREE.Color('#b2a57a')

    for (let row = 0; row <= segments; row += 1) {
      const z = size / 2 - (row / segments) * size
      for (let column = 0; column <= segments; column += 1) {
        const x = -size / 2 + (column / segments) * size
        const index = row * rowLength + column
        const height = getCampusTerrainHeight(x, z, buildings)
        const color = grassLow.clone().lerp(grassHigh, THREE.MathUtils.clamp((height + 0.2) / 1.4, 0, 1))

        positions[index * 3] = x
        positions[index * 3 + 1] = height
        positions[index * 3 + 2] = z
        colors[index * 3] = color.r
        colors[index * 3 + 1] = color.g
        colors[index * 3 + 2] = color.b

        if (column < segments && row < segments) {
          const nextRow = index + rowLength
          indices.push(index, index + 1, nextRow, nextRow, index + 1, nextRow + 1)
        }
      }
    }

    const terrain = new THREE.BufferGeometry()
    terrain.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    terrain.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    terrain.setIndex(indices)
    terrain.computeVertexNormals()
    return terrain
  }, [buildings])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  )
}

function InstancedGardens({ beds }: { beds: [number, number, number][] }) {
  const planterRef = useRef<THREE.InstancedMesh>(null)
  const soilRef = useRef<THREE.InstancedMesh>(null)
  const shrubRef = useRef<THREE.InstancedMesh>(null)
  const stemRef = useRef<THREE.InstancedMesh>(null)
  const flowerRef = useRef<THREE.InstancedMesh>(null)
  const planterInstances = useMemo(
    () => beds.map(([x, y, z]) => ({ position: [x, y + 0.12, z] as [number, number, number] })),
    [beds],
  )
  const soilInstances = useMemo(
    () => beds.map(([x, y, z]) => ({ position: [x, y + 0.28, z] as [number, number, number] })),
    [beds],
  )
  const shrubInstances = useMemo(
    () => beds.map(([x, y, z], index) => ({
      position: [x, y + 0.58, z] as [number, number, number],
      color: index % 2 === 0 ? '#638268' : '#788f70',
    })),
    [beds],
  )
  const flowers = useMemo(
    () => beds.flatMap(([x, y, z], bedIndex) =>
      Array.from({ length: 3 }, (_, index) => {
        const angle = (index / 3) * Math.PI * 2 + bedIndex * 0.19
        const flowerX = x + Math.cos(angle) * 0.65
        const flowerZ = z + Math.sin(angle) * 0.65
        return {
          stem: { position: [flowerX, y + 0.53, flowerZ] as [number, number, number] },
          blossom: {
            position: [flowerX, y + 0.78, flowerZ] as [number, number, number],
            color: index === 0 ? '#e2c99a' : '#d5b39a',
          },
        }
      }),
    ),
    [beds],
  )
  const stemInstances = useMemo(() => flowers.map(({ stem }) => stem), [flowers])
  const flowerInstances = useMemo(() => flowers.map(({ blossom }) => blossom), [flowers])

  usePopulateInstances(planterRef, planterInstances)
  usePopulateInstances(soilRef, soilInstances)
  usePopulateInstances(shrubRef, shrubInstances)
  usePopulateInstances(stemRef, stemInstances)
  usePopulateInstances(flowerRef, flowerInstances)

  return (
    <>
      <instancedMesh ref={planterRef} args={[undefined, undefined, beds.length]} receiveShadow>
        <cylinderGeometry args={[1.15, 1.08, 0.28, 12]} />
        <meshStandardMaterial color="#bdc6b5" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={soilRef} args={[undefined, undefined, beds.length]}>
        <cylinderGeometry args={[0.98, 0.98, 0.08, 12]} />
        <meshStandardMaterial color="#675b48" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={shrubRef} args={[undefined, undefined, beds.length]} castShadow>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.96} flatShading />
      </instancedMesh>
      <instancedMesh ref={stemRef} args={[undefined, undefined, stemInstances.length]} castShadow>
        <cylinderGeometry args={[0.025, 0.04, 0.42, 5]} />
        <meshStandardMaterial color="#648166" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={flowerRef} args={[undefined, undefined, flowerInstances.length]} castShadow>
        <dodecahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.82} flatShading />
      </instancedMesh>
    </>
  )
}

function InstancedTrees({ trees }: { trees: InstanceTransform[] }) {
  const rootRef = useRef<THREE.InstancedMesh>(null)
  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const branchRef = useRef<THREE.InstancedMesh>(null)
  const canopyRef = useRef<THREE.InstancedMesh>(null)
  const highlightRef = useRef<THREE.InstancedMesh>(null)
  const roots = useMemo(() => trees.map(({ position, scale }) => ({
    position: [position[0], position[1] + 0.09, position[2]] as [number, number, number],
    scale,
  })), [trees])
  const trunks = useMemo(() => trees.map(({ position, scale }) => ({
    position: [position[0], position[1] + 1.55 * (scale?.[1] ?? 1), position[2]] as [number, number, number],
    scale,
  })), [trees])
  const branches = useMemo(() => trees.flatMap(({ position, scale }) => {
    const size = scale?.[0] ?? 1
    return [-1, 1].map((side) => ({
      position: [position[0] + side * 0.42 * size, position[1] + 2.25 * size, position[2]] as [number, number, number],
      rotation: [0, 0, side * -0.5] as [number, number, number],
      scale,
    }))
  }), [trees])
  const canopies = useMemo(() => trees.map(({ position, scale }, index) => {
    const size = scale?.[0] ?? 1
    return {
    position: [position[0], position[1] + 3.45 * size, position[2]] as [number, number, number],
    scale: [size, size, size] as [number, number, number],
    color: index % 2 === 0 ? '#557c66' : '#658570',
  }}), [trees])
  const highlights = useMemo(() => trees.flatMap(({ position, scale }, index) => {
    const size = scale?.[0] ?? 1
    const colors = index % 2 === 0 ? ['#789779', '#668872', '#92a384'] : ['#86a083', '#6f8e78', '#a0aa8a']
    return [
      { position: [position[0] - 0.82 * size, position[1] + 3.16 * size, position[2] + 0.1 * size] as [number, number, number], scale: [1.04 * size, 1.04 * size, 1.04 * size] as [number, number, number], color: colors[0] },
      { position: [position[0] + 0.78 * size, position[1] + 3.95 * size, position[2] - 0.12 * size] as [number, number, number], scale: [1.08 * size, 1.08 * size, 1.08 * size] as [number, number, number], color: colors[1] },
      { position: [position[0] + 0.12 * size, position[1] + 4.65 * size, position[2] + 0.08 * size] as [number, number, number], scale: [0.82 * size, 0.82 * size, 0.82 * size] as [number, number, number], color: colors[2] },
    ]
  }), [trees])

  usePopulateInstances(rootRef, roots)
  usePopulateInstances(trunkRef, trunks)
  usePopulateInstances(branchRef, branches)
  usePopulateInstances(canopyRef, canopies)
  usePopulateInstances(highlightRef, highlights)

  return (
    <>
      <instancedMesh ref={rootRef} args={[undefined, undefined, roots.length]} receiveShadow>
        <cylinderGeometry args={[0.95, 1.15, 0.18, 10]} />
        <meshStandardMaterial color="#a49b7a" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trunks.length]} castShadow>
        <cylinderGeometry args={[0.22, 0.38, 2.9, 7]} />
        <meshStandardMaterial color="#80674f" roughness={0.96} />
      </instancedMesh>
      <instancedMesh ref={branchRef} args={[undefined, undefined, branches.length]} castShadow>
        <cylinderGeometry args={[0.11, 0.18, 1.45, 6]} />
        <meshStandardMaterial color="#806b52" roughness={0.96} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[undefined, undefined, canopies.length]} castShadow>
        <icosahedronGeometry args={[1.65, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} flatShading />
      </instancedMesh>
      <instancedMesh ref={highlightRef} args={[undefined, undefined, highlights.length]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} flatShading />
      </instancedMesh>
    </>
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
        <meshStandardMaterial color="#f0e2c5" emissive="#d4b77f" emissiveIntensity={0.28} roughness={0.36} />
      </mesh>
      <mesh position={[0, 4.21, 0]}>
        <boxGeometry args={[0.36, 0.06, 0.36]} />
        <meshStandardMaterial color="#d3ad70" emissive="#c49654" emissiveIntensity={0.34} />
      </mesh>
    </group>
  )
}

function RockOutcrops({ buildings }: { buildings: CampusBuilding[] }) {
  const rocks = [
    { x: 41.5, z: 3.5, scale: [1.8, 1.15, 1.3] },
    { x: 44, z: 5.2, scale: [1.15, 0.82, 1] },
    { x: 42.8, z: 1.7, scale: [0.9, 0.64, 1.1] },
    { x: -40.5, z: -6, scale: [1.7, 1.08, 1.35] },
    { x: -43, z: -4.4, scale: [1.1, 0.78, 0.95] },
    { x: -42.1, z: -8.1, scale: [0.92, 0.65, 1] },
    { x: 5, z: -45, scale: [1.7, 1.02, 1.25] },
    { x: 7.6, z: -43.2, scale: [1.05, 0.7, 0.9] },
    { x: 3, z: -43.1, scale: [0.9, 0.62, 1.1] },
    { x: -7, z: 43.5, scale: [1.8, 1.12, 1.4] },
    { x: -4.2, z: 45.3, scale: [1.05, 0.74, 1] },
    { x: -9.5, z: 45.4, scale: [0.95, 0.66, 1.05] },
  ]

  return (
    <group>
      {rocks.map(({ x, z, scale }, index) => (
        <mesh
          key={index}
          position={[x, getCampusTerrainHeight(x, z, buildings) + scale[1] * 0.48, z]}
          rotation={[index * 0.13, index * 0.47, index * 0.19]}
          scale={scale as [number, number, number]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? '#9c927a' : '#817b68'}
            roughness={0.94}
            flatShading
          />
        </mesh>
      ))}
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
      position={[(x / radius) * midpointRadius, -0.04, (z / radius) * midpointRadius]}
      rotation={[0, rotation, 0]}
    >
      <mesh receiveShadow>
        <boxGeometry args={[4.2, 0.16, length]} />
        <meshStandardMaterial color="#c9c4af" roughness={0.96} />
      </mesh>
      <mesh position={[0, 0.085, 0]} receiveShadow>
        <boxGeometry args={[3.55, 0.035, length - 0.12]} />
        <meshStandardMaterial color="#e2dccb" roughness={0.94} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.97, 0.08, 0]} receiveShadow>
          <boxGeometry args={[0.16, 0.14, length]} />
          <meshStandardMaterial color="#aaa58f" roughness={0.88} />
        </mesh>
      ))}
      {Array.from({ length: joints }, (_, index) => {
        const segmentZ = -length / 2 + (index + 1) * (length / (joints + 1))
        return (
          <mesh key={index} position={[0, 0.11, segmentZ]}>
            <boxGeometry args={[3.48, 0.016, 0.045]} />
            <meshStandardMaterial color="#b9b09b" roughness={0.9} />
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
        <meshStandardMaterial color="#e3ddcf" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[5.85, 5.85, 0.045, 64]} />
        <meshStandardMaterial color="#d1c9b8" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <torusGeometry args={[6.75, 0.09, 8, 72]} />
        <meshStandardMaterial color="#b7a982" roughness={0.84} metalness={0.06} />
      </mesh>
      <mesh position={[0, 0.05, -0.4]} receiveShadow>
        <cylinderGeometry args={[1.75, 1.85, 0.32, 16]} />
        <meshStandardMaterial color="#b0a58d" roughness={0.78} />
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
      {gardenAngles.filter((_, index) => index % 2 === 0).map((angle, index) => {
        const radius = 5.9
        const position: [number, number, number] = [Math.cos(angle) * radius, 0.07, Math.sin(angle) * radius]
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
  const trees = useMemo<InstanceTransform[]>(() => Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2 + Math.PI / 18
    const radius = index % 2 === 0 ? 48 : 52
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const size = index % 3 === 0 ? 1.18 : 0.92
    return {
      position: [x, getCampusTerrainHeight(x, z, buildings), z],
      scale: [size, size, size],
    }
  }), [buildings])

  const pathLandscaping = useMemo(() => buildings.flatMap((building) => {
    const [x, , z] = building.position
    const radius = Math.hypot(x, z)
    const directionX = x / radius
    const directionZ = z / radius
    const tangentX = -directionZ
    const tangentZ = directionX
    return [15, 25].map((distance) => {
      const gardenX = directionX * distance + tangentX * 4.1
      const gardenZ = directionZ * distance + tangentZ * 4.1
      return {
        position: [
          gardenX,
          getCampusTerrainHeight(gardenX, gardenZ, buildings) + 0.02,
          gardenZ,
        ] as [number, number, number],
      }
    })
  }), [buildings])

  const beds = useMemo(() => {
    const plazaBeds = Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * Math.PI * 2 + Math.PI / 8
      const radius = 8.7
      return [Math.cos(angle) * radius, 0.09, Math.sin(angle) * radius] as [number, number, number]
    })
    return [...plazaBeds, ...pathLandscaping.map(({ position }) => position)]
  }, [pathLandscaping])

  const pathLamps = useMemo(() => buildings.map((building) => {
    const [x, , z] = building.position
    const radius = Math.hypot(x, z)
    const directionX = x / radius
    const directionZ = z / radius
    const tangentX = -directionZ
    const tangentZ = directionX
    const lampX = directionX * 19 + tangentX * 3.2
    const lampZ = directionZ * 19 + tangentZ * 3.2
    return [lampX, getCampusTerrainHeight(lampX, lampZ, buildings), lampZ] as [number, number, number]
  }), [buildings])

  return (
    <group>
      <CampusTerrain buildings={buildings} />
      {buildings.map((building) => (
        <PathToBuilding key={building.id} building={building} />
      ))}
      <WelcomePlaza />
      <InstancedGardens beds={beds} />
      {pathLamps.map((position, index) => (
        <Lamp key={`path-lamp-${index}`} position={position} />
      ))}
      <InstancedTrees trees={trees} />
      <RockOutcrops buildings={buildings} />
    </group>
  )
}
