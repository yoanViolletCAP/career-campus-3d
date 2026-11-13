import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  CAMPUS_LIMIT,
  getCampusTerrainHeight,
  getBuildingRotation,
  getEntrancePosition,
  INTERACTION_DISTANCE,
  PLAYER_SPEED,
  type CampusBuilding,
} from '../data/campus'

type PlayerProps = {
  buildings: CampusBuilding[]
  position: THREE.Vector3
  onNearbyChange: (building: CampusBuilding | null) => void
  onInteract: (building: CampusBuilding) => void
}

const MOVEMENT_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyZ', 'KeyQ',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
])

function isBuildingCollision(x: number, z: number, buildings: CampusBuilding[]) {
  const playerRadius = 0.38

  return buildings.some((building) => {
    const [buildingX, , buildingZ] = building.position
    const rotation = getBuildingRotation(building)
    const deltaX = x - buildingX
    const deltaZ = z - buildingZ
    const localX = Math.cos(rotation) * deltaX - Math.sin(rotation) * deltaZ
    const localZ = Math.sin(rotation) * deltaX + Math.cos(rotation) * deltaZ

    return Math.abs(localX) < building.size[0] / 2 + playerRadius &&
      Math.abs(localZ) < building.size[2] / 2 + playerRadius
  })
}

export default function Player({ buildings, position, onNearbyChange, onInteract }: PlayerProps) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const keys = useRef(new Set<string>())
  const eWasDown = useRef(false)
  const direction = useRef(new THREE.Vector3())
  const cameraTarget = useRef(new THREE.Vector3())
  const cameraLookTarget = useRef(new THREE.Vector3())
  const cameraFocus = useRef(new THREE.Vector3())
  const cameraInitialized = useRef(false)
  const previousPlayerPosition = useRef(position.clone())
  const { camera } = useThree()
  const nearbyId = useRef<string | null>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' && !event.repeat) keys.current.add(event.code)
      if (!MOVEMENT_KEYS.has(event.code)) return

      const target = event.target
      if (target instanceof HTMLElement && target.isContentEditable) return
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return

      event.preventDefault()
      keys.current.add(event.code)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code)
    }
    const onBlur = () => {
      keys.current.clear()
      eWasDown.current = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  useFrame((state, delta) => {
    const elapsed = Math.min(delta, 0.05)
    const pressed = keys.current
    const horizontal =
      Number(pressed.has('KeyD') || pressed.has('ArrowRight')) -
      Number(pressed.has('KeyA') || pressed.has('KeyQ') || pressed.has('ArrowLeft'))
    const vertical =
      Number(pressed.has('KeyS') || pressed.has('ArrowDown')) -
      Number(pressed.has('KeyW') || pressed.has('KeyZ') || pressed.has('ArrowUp'))

    if (horizontal !== 0 || vertical !== 0) {
      direction.current.set(horizontal, 0, vertical).normalize()
      const nextX = THREE.MathUtils.clamp(
        position.x + direction.current.x * PLAYER_SPEED * elapsed,
        -CAMPUS_LIMIT,
        CAMPUS_LIMIT,
      )
      const nextZ = THREE.MathUtils.clamp(
        position.z + direction.current.z * PLAYER_SPEED * elapsed,
        -CAMPUS_LIMIT,
        CAMPUS_LIMIT,
      )

      if (!isBuildingCollision(nextX, position.z, buildings)) position.x = nextX
      if (!isBuildingCollision(position.x, nextZ, buildings)) position.z = nextZ
      group.current?.rotation.set(0, Math.atan2(direction.current.x, direction.current.z), 0)
    }

    const isMoving = horizontal !== 0 || vertical !== 0
    const walkCycle = state.clock.elapsedTime * 9
    const stride = isMoving ? Math.sin(walkCycle) * 0.46 : 0
    position.y = getCampusTerrainHeight(position.x, position.z, buildings) + 0.12
    if (group.current) group.current.position.copy(position)
    if (body.current) body.current.position.y = isMoving ? Math.abs(Math.sin(walkCycle)) * 0.045 : 0
    if (leftArm.current) leftArm.current.rotation.x = stride
    if (rightArm.current) rightArm.current.rotation.x = -stride
    if (leftLeg.current) leftLeg.current.rotation.x = -stride * 0.72
    if (rightLeg.current) rightLeg.current.rotation.x = stride * 0.72

    let closest: CampusBuilding | null = null
    let closestDistance = INTERACTION_DISTANCE
    for (const building of buildings) {
      const entrance = getEntrancePosition(building)
      const distance = Math.hypot(position.x - entrance[0], position.z - entrance[2])
      if (distance < closestDistance) {
        closest = building
        closestDistance = distance
      }
    }

    if (nearbyId.current !== (closest?.id ?? null)) {
      nearbyId.current = closest?.id ?? null
      onNearbyChange(closest)
    }

    const eDown = pressed.has('KeyE')
    if (eDown && !eWasDown.current && closest) onInteract(closest)
    eWasDown.current = eDown

    cameraTarget.current.set(position.x, position.y + 12, position.z + 20)
    cameraLookTarget.current.set(position.x, position.y + 1.6, position.z)
    const teleported = previousPlayerPosition.current.distanceTo(position) > 10
    const cameraBlend = 1 - Math.exp(-elapsed * 3.5)
    if (!cameraInitialized.current || teleported) {
      camera.position.copy(cameraTarget.current)
      cameraFocus.current.copy(cameraLookTarget.current)
      cameraInitialized.current = true
    } else {
      camera.position.lerp(cameraTarget.current, cameraBlend)
      cameraFocus.current.lerp(cameraLookTarget.current, cameraBlend)
    }
    camera.lookAt(cameraFocus.current)
    previousPlayerPosition.current.copy(position)
  })

  return (
    <group ref={group} position={position.toArray()} rotation={[0, Math.PI, 0]}>
      <group ref={body}>
        <mesh position={[0, 1.08, 0]} castShadow>
          <capsuleGeometry args={[0.37, 0.52, 5, 10]} />
          <meshStandardMaterial color="#485e52" roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[0.58, 0.22, 0.4]} />
          <meshStandardMaterial color="#625645" roughness={0.82} />
        </mesh>
        <mesh position={[0, 1.12, -0.39]} castShadow>
          <boxGeometry args={[0.68, 0.76, 0.34]} />
          <meshStandardMaterial color="#52675b" roughness={0.84} />
        </mesh>
        <mesh position={[0, 1.46, -0.39]} castShadow>
          <boxGeometry args={[0.52, 0.16, 0.36]} />
          <meshStandardMaterial color="#74846b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.94, -0.575]}>
          <boxGeometry args={[0.48, 0.28, 0.035]} />
          <meshStandardMaterial color="#6a5a46" roughness={0.84} />
        </mesh>
        <mesh position={[0, 1.1, -0.6]}>
          <boxGeometry args={[0.25, 0.035, 0.025]} />
          <meshStandardMaterial color="#d3b681" metalness={0.28} roughness={0.5} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh
            key={`pack-strap-${side}`}
            position={[side * 0.27, 1.14, -0.2]}
            rotation={[0.12, 0, side * -0.18]}
          >
            <boxGeometry args={[0.1, 0.72, 0.1]} />
            <meshStandardMaterial color="#b38b62" roughness={0.78} />
          </mesh>
        ))}
        <mesh position={[0, 1.38, 0.31]}>
          <boxGeometry args={[0.34, 0.32, 0.035]} />
          <meshStandardMaterial color="#e5edf0" roughness={0.74} />
        </mesh>
        <mesh position={[0, 1.08, 0.355]}>
          <boxGeometry args={[0.075, 0.52, 0.035]} />
          <meshStandardMaterial color="#72c1c5" metalness={0.18} roughness={0.38} />
        </mesh>
        <mesh position={[-0.22, 1.22, 0.305]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.21, 0.43, 0.055]} />
          <meshStandardMaterial color="#65756a" roughness={0.62} />
        </mesh>
        <mesh position={[0.22, 1.22, 0.305]} rotation={[0, 0, 0.22]}>
          <boxGeometry args={[0.21, 0.43, 0.055]} />
          <meshStandardMaterial color="#65756a" roughness={0.62} />
        </mesh>
        <mesh position={[0, 1.49, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.13, 0.2, 8]} />
          <meshStandardMaterial color="#c99f83" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.77, 0]} castShadow>
          <dodecahedronGeometry args={[0.31, 1]} />
          <meshStandardMaterial color="#d9b69b" roughness={0.82} flatShading />
        </mesh>
        <mesh position={[0, 1.91, -0.025]} castShadow>
          <sphereGeometry args={[0.315, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.53]} />
          <meshStandardMaterial color="#27333b" roughness={0.94} flatShading />
        </mesh>
        <mesh position={[-0.12, 2.0, -0.08]} rotation={[0.12, 0, -0.22]} castShadow>
          <sphereGeometry args={[0.19, 10, 7]} />
          <meshStandardMaterial color="#35414a" roughness={0.96} flatShading />
        </mesh>
        <mesh position={[0.2, 1.9, 0.02]} rotation={[0, 0, -0.28]} castShadow>
          <boxGeometry args={[0.12, 0.3, 0.11]} />
          <meshStandardMaterial color="#27333b" roughness={0.96} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.09, 1.79, 0.29]}>
            <sphereGeometry args={[0.022, 8, 6]} />
            <meshStandardMaterial color="#253744" roughness={0.6} />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <group key={`ear-${side}`}>
            <mesh position={[side * 0.3, 1.75, -0.005]}>
              <sphereGeometry args={[0.07, 8, 6]} />
              <meshStandardMaterial color="#d2ac91" roughness={0.86} />
            </mesh>
            <mesh position={[side * 0.09, 1.84, 0.302]}>
              <boxGeometry args={[0.08, 0.018, 0.018]} />
              <meshStandardMaterial color="#34434a" roughness={0.58} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.65, 0.294]}>
          <boxGeometry args={[0.11, 0.025, 0.025]} />
          <meshStandardMaterial color="#9e6d5f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.55, 0.16]} rotation={[0.18, 0, 0]}>
          <boxGeometry args={[0.18, 0.26, 0.12]} />
          <meshStandardMaterial color="#c0a184" roughness={0.8} />
        </mesh>
      </group>

      <group ref={leftArm} position={[-0.4, 1.34, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.38, 4, 8]} />
          <meshStandardMaterial color="#485e52" roughness={0.62} />
        </mesh>
        <mesh position={[0, -0.59, 0.015]} castShadow>
          <sphereGeometry args={[0.115, 10, 8]} />
          <meshStandardMaterial color="#d1ad92" roughness={0.86} />
        </mesh>
        <mesh position={[0, -0.5, 0.015]}>
          <torusGeometry args={[0.13, 0.035, 6, 10]} />
          <meshStandardMaterial color="#b7c7c3" roughness={0.7} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.4, 1.34, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.38, 4, 8]} />
          <meshStandardMaterial color="#485e52" roughness={0.62} />
        </mesh>
        <mesh position={[0, -0.59, 0.015]} castShadow>
          <sphereGeometry args={[0.115, 10, 8]} />
          <meshStandardMaterial color="#d1ad92" roughness={0.86} />
        </mesh>
        <mesh position={[0, -0.5, 0.015]}>
          <torusGeometry args={[0.13, 0.035, 6, 10]} />
          <meshStandardMaterial color="#b7c7c3" roughness={0.7} />
        </mesh>
      </group>
      <group ref={leftLeg} position={[-0.18, 0.66, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.4, 4, 8]} />
          <meshStandardMaterial color="#5c5144" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.57, 0.09]} castShadow>
          <boxGeometry args={[0.3, 0.18, 0.48]} />
          <meshStandardMaterial color="#393a35" roughness={0.86} />
        </mesh>
        <mesh position={[0, -0.66, 0.1]}>
          <boxGeometry args={[0.31, 0.045, 0.48]} />
          <meshStandardMaterial color="#b7c3be" roughness={0.86} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.18, 0.66, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.4, 4, 8]} />
          <meshStandardMaterial color="#5c5144" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.57, 0.09]} castShadow>
          <boxGeometry args={[0.3, 0.18, 0.48]} />
          <meshStandardMaterial color="#393a35" roughness={0.86} />
        </mesh>
        <mesh position={[0, -0.66, 0.1]}>
          <boxGeometry args={[0.31, 0.045, 0.48]} />
          <meshStandardMaterial color="#b7c3be" roughness={0.86} />
        </mesh>
      </group>
    </group>
  )
}
