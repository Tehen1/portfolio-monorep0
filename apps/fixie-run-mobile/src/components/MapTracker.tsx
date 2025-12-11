'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Square, MapPin, Route } from 'lucide-react'

interface LocationData {
  lat: number
  lng: number
  timestamp: number
  accuracy?: number
}

export function MapTracker() {
  const [isTracking, setIsTracking] = useState(false)
  const [locations, setLocations] = useState<LocationData[]>([])
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [totalDistance, setTotalDistance] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const watchIdRef = useRef<number | null>(null)

  // Fonction pour calculer la distance entre deux points GPS
  const calculateDistance = (loc1: LocationData, loc2: LocationData): number => {
    const R = 6371e3 // Rayon de la Terre en mètres
    const φ1 = loc1.lat * Math.PI / 180
    const φ2 = loc2.lat * Math.PI / 180
    const Δφ = (loc2.lat - loc1.lat) * Math.PI / 180
    const Δλ = (loc2.lng - loc1.lng) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // Distance en mètres
  }

  // Fonction pour obtenir la position GPS actuelle
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  // Démarrer le suivi GPS
  const startTracking = async () => {
    try {
      const position = await getCurrentPosition()
      const location: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: Date.now(),
        accuracy: position.coords.accuracy,
      }

      setCurrentLocation(location)
      setLocations([location])
      setIsTracking(true)
      setStartTime(new Date())

      // Surveiller les changements de position
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy,
          }

          setCurrentLocation(newLocation)
          setLocations(prev => {
            const updated = [...prev, newLocation]
            
            // Calculer la distance totale
            if (prev.length > 0) {
              const distance = calculateDistance(prev[prev.length - 1], newLocation)
              setTotalDistance(prev => prev + distance)
            }
            
            return updated
          })
        },
        (error) => console.error('Erreur GPS:', error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        }
      )
    } catch (error) {
      console.error('Erreur lors du démarrage:', error)
      alert('Impossible d\'obtenir votre position. Vérifiez les permissions GPS.')
    }
  }

  // Arrêter le suivi
  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
  }

  // Réinitialiser le suivi
  const resetTracking = () => {
    stopTracking()
    setLocations([])
    setCurrentLocation(null)
    setTotalDistance(0)
    setStartTime(null)
  }

  // Nettoyer au démontage
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(2)}km`
  }

  const formatDuration = (start: Date | null) => {
    if (!start) return '00:00'
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000)
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-fixie-primary to-fixie-secondary px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Suivi GPS en Temps Réel
        </h2>
      </div>

      {/* Contrôles */}
      <div className="p-6 border-b">
        <div className="flex flex-wrap gap-3 mb-4">
          {!isTracking ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startTracking}
              className="bg-fixie-primary hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Démarrer
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopTracking}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Pause className="w-5 h-5" />
              Pause
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTracking}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Square className="w-5 h-5" />
            Reset
          </motion.button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Distance totale</div>
            <div className="text-2xl font-bold text-fixie-dark">
              {formatDistance(totalDistance)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Durée</div>
            <div className="text-2xl font-bold text-fixie-dark">
              {formatDuration(startTime)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Points GPS</div>
            <div className="text-2xl font-bold text-fixie-dark">
              {locations.length}
            </div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="relative">
        <div 
          ref={mapRef}
          className="h-96 bg-gray-100 flex items-center justify-center relative overflow-hidden"
        >
          {/* Simulation de carte */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            {/* Grille de carte */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <div key={`h${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
              ))}
              {[...Array(10)].map((_, i) => (
                <div key={`v${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
              ))}
            </div>
            
            {/* Tracé du parcours */}
            <AnimatePresence>
              {locations.length > 1 && (
                <svg className="absolute inset-0 w-full h-full">
                  <polyline
                    points={locations.map(loc => 
                      `${(loc.lng + 180) * (100/360)}%,${(90 - loc.lat) * (100/180)}%`
                    ).join(' ')}
                    fill="none"
                    stroke="#FF6B6B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-lg"
                  />
                  
                  {/* Points du parcours */}
                  {locations.map((loc, index) => (
                    <circle
                      key={index}
                      cx={`${(loc.lng + 180) * (100/360)}%`}
                      cy={`${(90 - loc.lat) * (100/180)}%`}
                      r="4"
                      fill={index === locations.length - 1 ? "#4ECDC4" : "#FF6B6B"}
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              )}
            </AnimatePresence>

            {/* Position actuelle */}
            {currentLocation && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute"
                style={{
                  left: `${(currentLocation.lng + 180) * (100/360)}%`,
                  top: `${(90 - currentLocation.lat) * (100/180)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-6 h-6 bg-fixie-secondary rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Message quand pas de données */}
          {locations.length === 0 && (
            <div className="text-center">
              <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {isTracking ? 'Recherche du signal GPS...' : 'Cliquez sur "Démarrer" pour commencer le suivi'}
              </p>
            </div>
          )}
        </div>

        {/* Indicateur de précision */}
        {currentLocation?.accuracy && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
            Précision: ±{Math.round(currentLocation.accuracy)}m
          </div>
        )}
      </div>

      {/* Informations de session */}
      {locations.length > 0 && (
        <div className="p-6 bg-gray-50">
          <h3 className="font-semibold text-fixie-dark mb-3">Session Active</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Dernière mise à jour: {new Date().toLocaleTimeString()}</div>
            <div>Statut: {isTracking ? '🟢 En cours' : '⏸️ Pause'}</div>
            {currentLocation && (
              <div>
                Position: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}