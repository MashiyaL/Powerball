'use client';

import { useEffect, useRef } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import LotteryGame from './components/LotteryGame';

function SpinningBall() {
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = async () => {
      const { gsap } = await import('gsap');
      gsap.to(ballRef.current, {
        rotationY: 360,
        duration: 3,
        ease: 'none',
        repeat: -1,
      });
      gsap.to(ballRef.current, {
        y: -5,
        duration: 1.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    };
    animate();
  }, []);

  return (
    <div
      ref={ballRef}
      style={{ transformStyle: 'preserve-3d' }}
      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full relative cursor-default"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-xl shadow-purple-500/70" />
      <div className="absolute top-1 left-1.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/45 blur-[3px]" />
      <div className="absolute inset-0 rounded-full border-2 border-white/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-black text-sm sm:text-base drop-shadow-lg select-none">7</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      <header className="border-b border-cyan-500/30 backdrop-blur-md bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:py-8 flex justify-between items-center gap-4">
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <SpinningBall />
              <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-tight">
                Power Ball
              </h1>
            </div>
            <p className="text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 ml-12 sm:ml-14">
              NO RISK NO REWARD
            </p>
            <p className="text-cyan-300/60 text-xs sm:text-sm ml-12 sm:ml-14 font-semibold">Please play responsibly</p>
          </div>
          <div className="flex-shrink-0">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <LotteryGame />
      </div>
    </main>
  );
}