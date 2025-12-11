import { MapTracker } from '@/components/MapTracker'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-fixie-light to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-fixie-dark mb-2">
            🏃‍♂️ FixieRun
          </h1>
          <p className="text-xl text-fixie-accent">
            Suivi GPS en temps réel avec minting de NFTs
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <MapTracker />
        </div>
      </div>
    </main>
  )
}