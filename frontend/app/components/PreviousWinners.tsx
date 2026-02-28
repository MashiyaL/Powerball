'use client';

import { useEffect, useRef, useState } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { formatEther } from 'ethers';
import { LOTTERY_ADDRESS, LOTTERY_ABI } from '@/app/constants/contract';

interface Winner {
  player: string;
  amount: string;
  matchCount: number;
  txHash: string;
  blockNumber: bigint;
  timestamp?: string;
}

function TrophyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mr-2 flex-shrink-0"
    >
      <path
        d="M6 2h12v6a6 6 0 01-12 0V2z"
        stroke="url(#trophyGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M6 5H3a2 2 0 000 4h3M18 5h3a2 2 0 010 4h-3"
        stroke="url(#trophyGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 14v4M8 22h8M9 18h6"
        stroke="url(#trophyGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="trophyGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc"/>
          <stop offset="1" stopColor="#f472b6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function PreviousWinners() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const client = usePublicClient();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWinners = async () => {
      if (!client) return;
      try {
        setLoading(true);
        const logs = await client.getLogs({
          address: LOTTERY_ADDRESS,
          event: {
            type: 'event',
            name: 'PrizePaid',
            inputs: [
              { indexed: true,  name: 'player',     type: 'address' },
              { indexed: false, name: 'amount',     type: 'uint256' },
              { indexed: false, name: 'matchCount', type: 'uint8'   },
            ],
          },
          fromBlock: 'earliest',
          toBlock: 'latest',
        });

        const blockCache: Record<string, string> = {};
        const winnersData: Winner[] = await Promise.all(
          logs.map(async (log: any) => {
            const blockKey = log.blockNumber.toString();
            if (!blockCache[blockKey]) {
              try {
                const block = await client.getBlock({ blockNumber: log.blockNumber });
                const date = new Date(Number(block.timestamp) * 1000);
                blockCache[blockKey] = date.toLocaleString();
              } catch {
                blockCache[blockKey] = 'Unknown';
              }
            }
            return {
              player:      log.args.player,
              amount:      formatEther(log.args.amount),
              matchCount:  Number(log.args.matchCount),
              txHash:      log.transactionHash,
              blockNumber: log.blockNumber,
              timestamp:   blockCache[blockKey],
            };
          })
        );

        setWinners(winnersData.reverse());
      } catch (e) {
        console.error('Failed to fetch winners:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [client]);

  useWatchContractEvent({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'PrizePaid',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const newWinner: Winner = {
          player:      log.args.player,
          amount:      formatEther(log.args.amount),
          matchCount:  Number(log.args.matchCount),
          txHash:      log.transactionHash ?? '',
          blockNumber: log.blockNumber ?? BigInt(0),
          timestamp:   new Date().toLocaleString(),
        };
        setWinners(prev => [newWinner, ...prev]);
      });

      const animate = async () => {
        const { gsap } = await import('gsap');
        if (listRef.current?.firstElementChild) {
          gsap.fromTo(
            listRef.current.firstElementChild,
            { opacity: 0, x: -20, backgroundColor: 'rgba(250,204,21,0.3)' },
            { opacity: 1, x: 0,   backgroundColor: 'rgba(250,204,21,0)',   duration: 1, ease: 'power2.out' }
          );
        }
      };
      animate();
    },
  });

  const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  const matchColor = (m: number) => {
    if (m === 7) return 'text-yellow-300';
    if (m >= 5)  return 'text-pink-300';
    if (m >= 3)  return 'text-cyan-300';
    return 'text-green-300';
  };

  return (
    <div className="gsap-card bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-xl p-6 border border-purple-500/40 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
      <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 tracking-wide uppercase flex items-center">
        <TrophyIcon />
        Previous Winners
      </h3>

      {loading ? (
        <p className="text-purple-300/60 text-sm">Loading winners...</p>
      ) : winners.length === 0 ? (
        <p className="text-purple-300/60 text-sm">No winners yet — be the first!</p>
      ) : (
        <div ref={listRef} className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {winners.map((w, i) => (
            <div
              key={`${w.txHash}-${i}`}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-400/30 hover:border-purple-400/60 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <a
                  href={`https://sepolia.etherscan.io/address/${w.player}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-purple-300 hover:text-white transition-colors"
                >
                  {short(w.player)}
                </a>
                <span className={`text-xs font-black ${matchColor(w.matchCount)}`}>
                  {w.matchCount} match{w.matchCount !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white">{parseFloat(w.amount).toFixed(4)} ETH</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${w.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400/60 hover:text-purple-300 transition-colors font-mono"
                >
                  {w.txHash ? `${w.txHash.slice(0, 8)}…` : ''}
                </a>
              </div>
              {w.timestamp && (
                <p className="text-xs text-purple-400/40 mt-1">{w.timestamp}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}