import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '../lib/wagmi';
import { AppKitProvider } from '@reown/appkit/react';
import { mainnet, polygon, zkSync } from '@reown/appkit/networks';

const queryClient = new QueryClient();

// AppKit configuration
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

const metadata = {
  name: 'FIXIE.RUN',
  description: 'Web3 Fitness dApp - Metabolic Tracking & Tokenized Rewards',
  url: 'https://fixie.run',
  icons: ['https://fixie.run/icon.png']
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider
          projectId={projectId}
          networks={[mainnet, polygon, zkSync]}
          metadata={metadata}
          themeMode="light"
        >
          <Component {...pageProps} />
        </AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
