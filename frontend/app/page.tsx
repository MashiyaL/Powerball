'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import LotteryGame from './components/LotteryGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Header */}
      <header className="border-b border-cyan-500/30 backdrop-blur-md bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎲</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-tight">
                Power Ball
              </h1>
            </div>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 ml-12">
              NO RISK NO REWARD
            </p>
            <p className="text-cyan-300/60 text-sm ml-12 font-semibold">Sepolia Testnet</p>
          </div>
          <ConnectButton showBalance={false} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LotteryGame />
      </div>
    </main>
  );
}

