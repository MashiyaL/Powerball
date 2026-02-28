'use client';

import { useEffect, useRef, useState } from 'react';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { LOTTERY_ADDRESS, LOTTERY_ABI } from '@/app/constants/contract';

export default function WinningNumbers() {
  const ballRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [justDrawn, setJustDrawn] = useState(false);
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number>(0);

  const { data: drawPendingData } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'drawPending',
    query: { refetchInterval: 3000 },
  });

  const drawPending = drawPendingData as boolean | undefined;

  const { data: drawTimestampData } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'lastDrawTimestamp',
    query: { refetchInterval: 5000 },
  });

  const { data: num0, refetch: r0 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [0], query: { refetchInterval: 5000 } });
  const { data: num1, refetch: r1 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [1], query: { refetchInterval: 5000 } });
  const { data: num2, refetch: r2 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [2], query: { refetchInterval: 5000 } });
  const { data: num3, refetch: r3 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [3], query: { refetchInterval: 5000 } });
  const { data: num4, refetch: r4 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [4], query: { refetchInterval: 5000 } });
  const { data: num5, refetch: r5 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [5], query: { refetchInterval: 5000 } });
  const { data: num6, refetch: r6 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [6], query: { refetchInterval: 5000 } });

  const numbers = [num0, num1, num2, num3, num4, num5, num6]
    .map(n => (n ? Number(n) : 0))
    .filter(n => n > 0);

  const formattedTimestamp = drawTimestampData && Number(drawTimestampData) > 0
    ? new Date(Number(drawTimestampData) * 1000).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : null;

  useEffect(() => {
    const currentTimestamp = drawTimestampData ? Number(drawTimestampData) : 0;
    if (currentTimestamp === 0) return;

    if (lastSeenTimestamp === 0) {
      setLastSeenTimestamp(currentTimestamp);
      return;
    }

    if (currentTimestamp !== lastSeenTimestamp) {
      setLastSeenTimestamp(currentTimestamp);
      [r0, r1, r2, r3, r4, r5, r6].forEach(r => r());
      setJustDrawn(true);
      setTimeout(() => setJustDrawn(false), 4000);
    }
  }, [drawTimestampData]);

  useWatchContractEvent({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'WinningNumbersDrawn',
    onLogs() {
      [r0, r1, r2, r3, r4, r5, r6].forEach(r => r());
      setJustDrawn(true);
      setTimeout(() => setJustDrawn(false), 4000);
    },
  });

  useEffect(() => {
    if (numbers.length === 0) return;
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      gsap.fromTo(
        ballRefs.current.filter(Boolean),
        { scale: 0, opacity: 0, y: -30, rotation: -180 },
        { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)' }
      );
    };
    loadGSAP();
  }, [numbers.join(',')]);

  useEffect(() => {
    if (!justDrawn || numbers.length === 0) return;
    const animate = async () => {
      const { gsap } = await import('gsap');
      gsap.fromTo(
        ballRefs.current.filter(Boolean),
        { scale: 0, opacity: 0, rotation: -360, y: -60 },
        { scale: 1, opacity: 1, rotation: 0, y: 0, duration: 0.8, stagger: 0.1, ease: 'elastic.out(1, 0.5)' }
      );
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { boxShadow: '0 0 0px rgba(250,204,21,0)' },
          { boxShadow: '0 0 60px rgba(250,204,21,0.6)', duration: 0.4, yoyo: true, repeat: 3, ease: 'power2.inOut' }
        );
      }
    };
    animate();
  }, [justDrawn]);

  if (drawPending === true) {
    return (
      <div className="text-center py-12">
        <p className="text-yellow-300 font-black text-sm uppercase tracking-widest animate-pulse">
          Draw in progress...
        </p>
        <p className="text-sm text-cyan-300/50 mt-3 uppercase tracking-wider">
          Winning numbers will appear once the draw is complete
        </p>
      </div>
    );
  }

  if (numbers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cyan-200/70 font-semibold text-lg">No winning numbers yet</p>
        <p className="text-sm text-cyan-300/50 mt-3 uppercase tracking-wider">
          Draw happens automatically every 5 minutes (testnet)
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6 rounded-xl transition-all duration-300">
      {justDrawn && (
        <p className="text-center text-yellow-300 font-black text-sm uppercase tracking-widest animate-pulse">
          New numbers just drawn!
        </p>
      )}
      <div className="flex gap-3 flex-wrap justify-center">
        {numbers.map((num, index) => (
          <div
            key={index}
            ref={el => { ballRefs.current[index] = el; }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 via-pink-500 to-purple-500 flex items-center justify-center font-black text-white shadow-2xl shadow-pink-500/50 hover:shadow-3xl hover:scale-110 transition-all border-2 border-yellow-300/50 cursor-default"
          >
            {num}
          </div>
        ))}
      </div>
      {formattedTimestamp && (
        <p className="text-sm text-pink-300/60 text-center font-semibold uppercase tracking-widest tabular-nums">
          Last Draw: {formattedTimestamp}
        </p>
      )}
    </div>
  );
}