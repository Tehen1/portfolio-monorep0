'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, polygon, sepolia, bsc } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Configuration des réseaux supportés
const networks = {
  mainnet: mainnet,
  polygon: polygon,
  sepolia: sepolia,
  bsc: bsc,
}

// Configuration Wagmi
const config = createConfig({
  chains: [sepolia, polygon, mainnet, bsc],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia.publicnode.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [mainnet.id]: http('https://ethereum.publicnode.com'),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  connectors: [
    // Connecteurs de wallets supportés
    window?.ethereum ? (window as any).ethereum : null,
  ].filter(Boolean),
})

interface Web3ProviderProps {
  children: React.ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
      },
    },
  }))

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Hook pour utiliser le provider
export function useWeb3() {
  return {
    config,
    networks,
  }
}