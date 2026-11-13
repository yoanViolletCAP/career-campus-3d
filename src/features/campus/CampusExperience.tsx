import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import CanvasFallback from '../../app/components/CanvasFallback'
import CampusErrorBoundary from '../../shared/CampusErrorBoundary'
import {
  campusBuildings,
  type CampusBuilding,
  type CampusNavigationRequest,
} from './data/campus'
import CampusScene from './scene/CampusScene'
import type { LoadingStage } from '../../app/components/LoadingScreen'

type CampusExperienceProps = {
  navigationRequest: CampusNavigationRequest | null
  onNearbyChange: (building: CampusBuilding | null) => void
  onInteract: (building: CampusBuilding) => void
  onNavigate: (building: CampusBuilding) => void
  onLoadingStageChange: (stage: LoadingStage) => void
}

export default function CampusExperience({
  navigationRequest,
  onNearbyChange,
  onInteract,
  onNavigate,
  onLoadingStageChange,
}: CampusExperienceProps) {
  const playerPosition = useRef(new THREE.Vector3(0, 0, 1.8))

  useEffect(() => {
    onLoadingStageChange('scene')
  }, [onLoadingStageChange])

  useEffect(() => {
    if (navigationRequest) playerPosition.current.set(...navigationRequest.position)
  }, [navigationRequest])

  const fallback = (
    <CanvasFallback
      onNavigate={onNavigate}
      onUnavailable={() => onLoadingStageChange('ready')}
    />
  )

  return (
    <CampusErrorBoundary fallback={fallback}>
      <Canvas
        className="campus-canvas"
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 7, 11], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        fallback={fallback}
        onCreated={() => onLoadingStageChange('renderer')}
      >
        <CampusScene
          buildings={campusBuildings}
          playerPosition={playerPosition.current}
          onNearbyChange={onNearbyChange}
          onInteract={onInteract}
          onNavigate={onNavigate}
          onFirstFrame={() => onLoadingStageChange('ready')}
        />
      </Canvas>
    </CampusErrorBoundary>
  )
}
