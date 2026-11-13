import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import {
  getEntrancePosition,
  type CampusNavigationRequest,
  type CampusBuilding,
} from '../features/campus/data/campus'
import BrandPanel from './components/BrandPanel'
import ControlHint from './components/ControlHint'
import DestinationList from '../features/navigation/DestinationList'
import BuildingPanel from '../features/portfolio/BuildingPanel'
import LoadingScreen, { type LoadingStage } from './components/LoadingScreen'

const CampusExperience = lazy(() => import('../features/campus/CampusExperience'))

export default function App() {
  const [nearbyBuilding, setNearbyBuilding] = useState<CampusBuilding | null>(null)
  const [activeBuilding, setActiveBuilding] = useState<CampusBuilding | null>(null)
  const [navigationRequest, setNavigationRequest] = useState<CampusNavigationRequest | null>(null)
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('interface')
  const [loadingVisible, setLoadingVisible] = useState(true)

  const handleNearbyChange = useCallback((building: CampusBuilding | null) => {
    setNearbyBuilding(building)
  }, [])

  const handleInteract = useCallback((building: CampusBuilding) => {
    setActiveBuilding(building)
  }, [])

  const handleNavigate = useCallback((building: CampusBuilding) => {
    setNavigationRequest((previous) => ({
      id: (previous?.id ?? 0) + 1,
      position: getEntrancePosition(building),
    }))
    setNearbyBuilding(building)
    setActiveBuilding(building)
  }, [])

  const handleLoadingStageChange = useCallback((stage: LoadingStage) => {
    setLoadingStage(stage)
  }, [])

  const handleLoadingComplete = useCallback(() => {
    setLoadingVisible(false)
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveBuilding(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <main className="app-shell">
      <Suspense fallback={null}>
        <CampusExperience
          navigationRequest={navigationRequest}
          onNearbyChange={handleNearbyChange}
          onInteract={handleInteract}
          onNavigate={handleNavigate}
          onLoadingStageChange={handleLoadingStageChange}
        />
      </Suspense>

      <BrandPanel />
      <ControlHint nearbyBuilding={nearbyBuilding} />

      <section className="mobile-navigation" aria-label="Accès rapide aux espaces">
        <span className="mobile-navigation__label">EXPLORER LES ESPACES</span>
        <DestinationList onNavigate={handleNavigate} />
      </section>

      {activeBuilding && (
        <BuildingPanel building={activeBuilding} onClose={() => setActiveBuilding(null)} />
      )}
      {loadingVisible && (
        <LoadingScreen
          stage={loadingStage}
          onComplete={handleLoadingComplete}
        />
      )}
    </main>
  )
}
