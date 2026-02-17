'use client';

export default function PrizePool({ amount }: { amount?: string }) {
  return (
    <div className="space-y-4">
      <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400">
        {amount || '0'} ETH
      </div>
      <div className="space-y-3 text-sm font-semibold">
        <p className="text-yellow-200/80">💰 Total prize pool available</p>
        <p className="text-pink-200/80">🔄 Rollovers to next draw</p>
      </div>
    </div>
  );
}
