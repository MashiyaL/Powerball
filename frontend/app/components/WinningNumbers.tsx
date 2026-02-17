'use client';

export default function WinningNumbers({ numbers }: { numbers: number[] }) {
  if (!numbers || numbers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cyan-200/70 font-semibold text-lg">No winning numbers yet</p>
        <p className="text-sm text-cyan-300/50 mt-3 uppercase tracking-wider">🎲 Draw happens automatically every 5 minutes (testnet)</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap justify-center">
        {numbers.map((num, index) => (
          <div
            key={index}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 via-pink-500 to-purple-500 flex items-center justify-center font-black text-white shadow-2xl shadow-pink-500/50 hover:shadow-3xl hover:scale-110 transition-all border-2 border-yellow-300/50"
          >
            {num}
          </div>
        ))}
      </div>
      <p className="text-sm text-pink-300/60 text-center font-semibold uppercase tracking-widest">
        🏆 Last Draw: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
