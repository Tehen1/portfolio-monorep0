import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { Features } from './components/Features';
import { Marketplace } from './components/Marketplace';
import { Whitepaper } from './components/Whitepaper';
import { DataSync } from './components/DataSync';
import { UrbanDashboard } from './components/urban/UrbanDashboard';
import { Footer } from './components/Footer';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { MultiChainStrategy } from './components/MultiChainStrategy';
import { BikeDetailView } from './components/BikeDetailView';
import { useTranslation } from './context/LanguageContext';
import type { RideHistoryEntry } from './types';

const Section: React.FC<{ id: string; title: string; children: React.ReactNode; className?: string, bgVideo?: string }> = ({ id, title, children, className = '', bgVideo }) => (
  <section id={id} className={`relative py-16 sm:py-20 overflow-hidden ${className}`}>
     {bgVideo && (
        <video autoPlay muted loop playsInline className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-[0.03]">
            <source src={bgVideo} type="video/mp4" />
        </video>
    )}
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <h2 className="text-3xl sm:text-4xl font-black text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-purple">
        {title}
      </h2>
      {children}
    </div>
  </section>
);

function App() {
  const { t } = useTranslation();
  const [rideHistory, setRideHistory] = useState<RideHistoryEntry[]>([]);

  return (
    <div className="bg-brand-bg text-white font-sans">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Hero />
              </div>
              
              <Section id="dashboard" title={t('header.dashboard')} bgVideo="/rewards-optimized.mp4">
                <Dashboard rideHistory={rideHistory} setRideHistory={setRideHistory} />
              </Section>
              
              <Section id="analytics" title={t('app.sections.analytics')} bgVideo="/profile-optimized.mp4">
                  <AnalyticsDashboard rideHistory={rideHistory} setRideHistory={setRideHistory} />
              </Section>
              
              <Section id="urban-analytics" title={t('app.sections.urban')}>
                  <UrbanDashboard />
              </Section>
              
              <Section id="features" title={t('app.sections.features')}>
                <Features />
              </Section>
              
              <Section id="architecture" title={t('app.sections.architecture')} className="bg-brand-surface/50">
                <MultiChainStrategy />
              </Section>

              <Section id="marketplace" title={t('app.sections.marketplace')}>
                <Marketplace />
              </Section>

              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <DataSync />
              </div>

              <Section id="whitepaper" title={t('app.sections.whitepaper')} className="bg-brand-surface/50">
                <Whitepaper />
              </Section>
            </>
          } />
          <Route path="/marketplace/:bikeId" element={<BikeDetailView />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;