'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccount, useReadContract, useWatchContractEvent, usePublicClient } from 'wagmi';
import { formatEther } from 'ethers';
import { parseAbiItem } from 'viem';
import TicketForm, { SUBMITTED_NUMBERS_KEY } from './TicketForm';
import WinningNumbers from './WinningNumbers';
import PreviousWinners from './PreviousWinners';
import { LOTTERY_ADDRESS, LOTTERY_ABI } from '@/app/constants/contract';

function countSequentialMatches(playerNums: number[], winningNums: number[]): number {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    if (playerNums[i] === winningNums[i]) count++;
    else break;
  }
  return count;
}

function DrawResultBanner({
  drawResult,
  onDismiss,
}: {
  drawResult: {
    matched: number;
    prize: string;
    won: boolean;
    playerNumbers: number[];
    winningNumbers: number[];
  };
  onDismiss: () => void;
}) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ballsRowRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = async () => {
      const { gsap } = await import('gsap');

      gsap.fromTo(
        bannerRef.current,
        { scale: 0.85, opacity: 0, y: -40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' }
      );

      gsap.fromTo(
        titleRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, delay: 0.4, ease: 'back.out(2)' }
      );

      if (ballsRowRef.current) {
        const balls = ballsRowRef.current.querySelectorAll('.result-ball');
        gsap.fromTo(
          balls,
          { scale: 0, opacity: 0, rotation: -180 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.5, stagger: 0.07, delay: 0.6, ease: 'back.out(1.7)' }
        );
      }

      if (drawResult.won && shimmerRef.current) {
        gsap.fromTo(
          shimmerRef.current,
          { x: '-100%', opacity: 0.6 },
          { x: '200%', opacity: 0, duration: 1.2, delay: 0.8, ease: 'power2.inOut', repeat: 2, repeatDelay: 1.5 }
        );
      }

      if (!drawResult.won && bannerRef.current) {
        gsap.to(bannerRef.current, {
          x: [-6, 6, -4, 4, -2, 2, 0],
          duration: 0.5,
          delay: 0.8,
          ease: 'power2.inOut',
        });
      }
    };
    animate();
  }, []);

  return (
    <div
      ref={bannerRef}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl text-center p-6 sm:p-8 shadow-2xl ${
        drawResult.won
          ? 'bg-gradient-to-br from-green-900/60 via-emerald-900/40 to-cyan-900/60 border-green-400/60 shadow-green-500/30'
          : 'bg-gradient-to-br from-red-900/60 via-rose-900/40 to-pink-900/60 border-red-400/60 shadow-red-500/30'
      }`}
    >
      {drawResult.won && (
        <div
          ref={shimmerRef}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
        />
      )}

      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          drawResult.won
            ? 'bg-gradient-to-r from-green-400 via-cyan-400 to-green-400'
            : 'bg-gradient-to-r from-red-400 via-pink-400 to-red-400'
        }`}
      />

      <h3
        ref={titleRef}
        className={`text-3xl sm:text-4xl font-black mb-3 tracking-tight ${
          drawResult.won
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-cyan-300'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-rose-200 to-pink-300'
        }`}
      >
        {drawResult.won ? 'YOU WON!' : 'NO WIN THIS ROUND'}
      </h3>

      {drawResult.won ? (
        <div className="space-y-1 mb-5">
          <p className="text-white font-bold text-lg">
            {drawResult.matched} sequential {drawResult.matched === 1 ? 'match' : 'matches'}
          </p>
          <p className="text-green-300 text-2xl font-black">{drawResult.prize} ETH</p>
          <p className="text-green-400/70 text-xs uppercase tracking-widest">sent to your wallet</p>
        </div>
      ) : (
        <p className="text-pink-200/80 font-semibold mb-5 text-sm sm:text-base">
          {drawResult.matched > 0
            ? `${drawResult.matched} sequential match${drawResult.matched > 1 ? 'es' : ''} — need at least 2 to win`
            : 'No sequential matches this draw'}
        </p>
      )}

      {drawResult.playerNumbers.length === 7 && (
        <div ref={ballsRowRef} className="mt-2 mb-6 space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Your numbers</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {drawResult.playerNumbers.map((n, i) => {
                const matched = n === drawResult.winningNumbers[i];
                return (
                  <div
                    key={i}
                    className={`result-ball w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm border-2 ${
                      matched
                        ? 'bg-green-500/40 border-green-400 text-green-200 shadow-lg shadow-green-500/40'
                        : 'bg-white/5 border-white/15 text-white/50'
                    }`}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            {drawResult.playerNumbers.map((n, i) => (
              <div key={i} className="w-10 h-4 sm:w-12 flex items-center justify-center">
                <div
                  className={`w-2 h-2 rounded-full ${
                    n === drawResult.winningNumbers[i] ? 'bg-green-400' : 'bg-red-400/40'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Winning numbers</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {drawResult.winningNumbers.map((n, i) => {
                const matched = n === drawResult.playerNumbers[i];
                return (
                  <div
                    key={i}
                    className={`result-ball w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm border-2 ${
                      matched
                        ? 'bg-green-500/40 border-green-400 text-green-200 shadow-lg shadow-green-500/40'
                        : 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300'
                    }`}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-white/25 uppercase tracking-widest">
            Sequential match stops at first mismatch
          </p>
        </div>
      )}

      <p className="text-white/30 text-xs uppercase tracking-wider mb-3">
        New round started — buy another ticket below
      </p>
      <button
        onClick={onDismiss}
        className={`px-6 py-2.5 text-xs uppercase tracking-widest rounded-xl font-bold border transition-all ${
          drawResult.won
            ? 'border-green-400/40 text-green-300/70 hover:text-green-200 hover:border-green-400/70 hover:bg-green-500/10'
            : 'border-white/15 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5'
        }`}
      >
        Dismiss
      </button>
    </div>
  );
}

export default function LotteryGame() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const mainRef = useRef<HTMLDivElement>(null);

  const [drawResult, setDrawResult] = useState<{
    matched: number;
    prize: string;
    won: boolean;
    playerNumbers: number[];
    winningNumbers: number[];
  } | null>(null);

  const [roundKey, setRoundKey] = useState(0);
  const [drawWasTriggered, setDrawWasTriggered] = useState(false);
  const prevDrawPending = useRef<boolean | null>(null);

  const { data: prizePoolData, isLoading: isPoolLoading, refetch: refetchPool } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'prizePool',
    query: { refetchInterval: 5000 },
  });

  const { data: playersData, isLoading: isPlayersLoading, refetch: refetchPlayers } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'getPlayers',
    query: { refetchInterval: 5000 },
  });

  const { data: drawPendingData } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'drawPending',
    query: { refetchInterval: 3000 },
  });

  const { data: w0, refetch: rw0 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [0] });
  const { data: w1, refetch: rw1 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [1] });
  const { data: w2, refetch: rw2 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [2] });
  const { data: w3, refetch: rw3 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [3] });
  const { data: w4, refetch: rw4 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [4] });
  const { data: w5, refetch: rw5 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [5] });
  const { data: w6, refetch: rw6 } = useReadContract({ address: LOTTERY_ADDRESS, abi: LOTTERY_ABI, functionName: 'lastWinningNumbers', args: [6] });

  useEffect(() => {
    const current = drawPendingData as boolean | undefined;
    if (current === undefined) return;

    const prev = prevDrawPending.current;

    if (prev === false && current === true) {
      setDrawWasTriggered(true);
    }

    if (prev === true && current === false && drawWasTriggered) {
      setDrawWasTriggered(false);
      refetchPool();
      refetchPlayers();
      setRoundKey(k => k + 1);

      const saved = sessionStorage.getItem(SUBMITTED_NUMBERS_KEY);
      const playerNumbers: number[] = saved ? JSON.parse(saved) : [];

      if (playerNumbers.length !== 7) {
        prevDrawPending.current = current;
        return;
      }

      Promise.all([rw0(), rw1(), rw2(), rw3(), rw4(), rw5(), rw6()]).then(results => {
        const winningNumbers = results.map(r => Number(r.data));

        if (!winningNumbers.every(n => n > 0)) return;

        const matched = countSequentialMatches(playerNumbers, winningNumbers);

        if (!publicClient || !address) {
          setDrawResult({ won: matched >= 2, matched, prize: '0', playerNumbers, winningNumbers });
          sessionStorage.removeItem(SUBMITTED_NUMBERS_KEY);
          return;
        }

        publicClient.getBlockNumber().then(blockNumber => {
          const fromBlock = blockNumber > BigInt(200) ? blockNumber - BigInt(200) : BigInt(0);
          return publicClient.getLogs({
            address: LOTTERY_ADDRESS as `0x${string}`,
            event: parseAbiItem('event PrizePaid(address indexed player, uint256 amount, uint8 matchCount)'),
            fromBlock,
            toBlock: 'latest',
          });
        }).then(logs => {
          const myLog = logs.find(
            log => (log.args as any).player?.toLowerCase() === address.toLowerCase()
          );
          setDrawResult({
            won: !!myLog,
            matched,
            prize: myLog ? formatEther((myLog.args as any).amount as bigint) : '0',
            playerNumbers,
            winningNumbers,
          });
          sessionStorage.removeItem(SUBMITTED_NUMBERS_KEY);
        }).catch(() => {
          setDrawResult({ won: matched >= 2, matched, prize: '0', playerNumbers, winningNumbers });
          sessionStorage.removeItem(SUBMITTED_NUMBERS_KEY);
        });
      });
    }

    prevDrawPending.current = current;
  }, [drawPendingData, drawWasTriggered]);

  useWatchContractEvent({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'TicketPurchased',
    onLogs() {
      refetchPool();
      refetchPlayers();
    },
  });

  useEffect(() => {
    if (!isConnected) return;
    const animate = async () => {
      const { gsap } = await import('gsap');
      if (mainRef.current) {
        gsap.fromTo(
          mainRef.current.querySelectorAll('.gsap-card'),
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out' }
        );
      }
    };
    animate();
  }, [isConnected]);

  const prizePool = prizePoolData ? formatEther(prizePoolData as bigint) : '0';
  const players = playersData ? Array.from(playersData as readonly string[]) : [];

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center py-24 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-purple-200">Please connect your wallet to play</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {drawResult && (
          <DrawResultBanner drawResult={drawResult} onDismiss={() => setDrawResult(null)} />
        )}

        <div className="gsap-card bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-xl p-5 sm:p-8 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-5 sm:mb-6">
            Buy Ticket
          </h2>
          <TicketForm key={roundKey} />
        </div>

        <div className="gsap-card bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-xl p-5 sm:p-8 border border-pink-500/30 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 mb-5 sm:mb-6">
            Latest Winning Numbers
          </h2>
          <WinningNumbers />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="gsap-card bg-gradient-to-br from-yellow-600/20 via-pink-600/20 to-purple-600/20 rounded-xl p-5 sm:p-8 border border-yellow-400/50 backdrop-blur-xl shadow-2xl shadow-yellow-500/30">
          <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-2 tracking-widest">PRIZE POOL</h3>
          {isPoolLoading ? (
            <div className="text-yellow-300 text-sm">Loading...</div>
          ) : (
            <>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 mb-2">
                {parseFloat(prizePool).toFixed(4)}
              </div>
              <p className="text-yellow-200/70 text-sm">ETH</p>
              <p className="text-yellow-200/60 text-xs mt-3 font-semibold">Rolls over if unclaimed</p>
            </>
          )}
        </div>

        <div className="gsap-card bg-gradient-to-br from-gray-900 via-cyan-900/50 to-gray-900 rounded-xl p-5 sm:p-6 border border-cyan-500/40 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
          <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 tracking-wide">
            PLAYERS ({players.length})
          </h3>
          {isPlayersLoading ? (
            <div className="text-cyan-300 text-sm">Loading players...</div>
          ) : players.length === 0 ? (
            <p className="text-cyan-200/60 text-sm">No players yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-400/30 hover:border-cyan-400/60 transition-all hover:bg-cyan-500/20"
                >
                  <p className="text-xs text-cyan-300 font-mono font-semibold break-all leading-relaxed">
                    {player}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="gsap-card bg-gradient-to-br from-gray-900 via-pink-900/50 to-gray-900 rounded-xl p-5 sm:p-6 border border-pink-500/40 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
          <p className="text-xs text-pink-300/70 mb-2 uppercase tracking-widest font-bold">Your Address</p>
          {isConnected && address ? (
            <p className="text-xs sm:text-sm font-mono text-pink-300 break-all bg-pink-500/10 p-3 rounded-lg border border-pink-400/30 leading-relaxed">
              {address}
            </p>
          ) : (
            <p className="text-sm text-pink-300/60">Not connected</p>
          )}
        </div>

        <PreviousWinners />
      </div>
    </div>
  );
}