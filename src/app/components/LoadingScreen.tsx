import { useEffect, useRef } from 'react'

export type LoadingStage = 'interface' | 'scene' | 'renderer' | 'ready'

type LoadingScreenProps = {
  stage: LoadingStage
  onComplete: () => void
}

const STAGE_DETAILS: Record<LoadingStage, { progress: number; label: string }> = {
  interface: { progress: 14, label: 'Préparation de l’interface' },
  scene: { progress: 42, label: 'Chargement de l’expérience 3D' },
  renderer: { progress: 78, label: 'Initialisation du campus' },
  ready: { progress: 100, label: 'Campus prêt' },
}

export default function LoadingScreen({ stage, onComplete }: LoadingScreenProps) {
  const startedAt = useRef(Date.now())
  const { progress, label } = STAGE_DETAILS[stage]

  useEffect(() => {
    if (stage !== 'ready') return

    const minimumDuration = 700
    const remaining = Math.max(0, minimumDuration - (Date.now() - startedAt.current))
    const timeout = window.setTimeout(onComplete, remaining)
    return () => window.clearTimeout(timeout)
  }, [onComplete, stage])

  return (
    <div
      className={`loading-screen${stage === 'ready' ? ' loading-screen--ready' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Chargement du campus"
    >
      <div className="loading-card">
        <div className="loading-brand">
          <span className="loading-mark" aria-hidden="true">CV</span>
          <span className="eyebrow">PORTFOLIO IMMERSIF</span>
        </div>
        <p className="loading-overline">CAREERVERSE · CAMPUS</p>
        <h1>Un nouvel espace<br />prend forme.</h1>
        <p className="loading-description">
          Préparation du campus et de ses espaces de découverte.
        </p>
        <div
          className="loading-progress"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="loading-progress__track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="loading-progress__meta">
            <span>{label}</span>
            <strong>{progress}%</strong>
          </div>
        </div>
        <div className="loading-footer">
          <span className="loading-pulse" />
          Les éléments 3D sont chargés après l’interface.
        </div>
      </div>
      <span className="loading-orbit loading-orbit--one" aria-hidden="true" />
      <span className="loading-orbit loading-orbit--two" aria-hidden="true" />
    </div>
  )
}
