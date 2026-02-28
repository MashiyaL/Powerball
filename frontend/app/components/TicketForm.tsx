'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'ethers';
import { LOTTERY_ADDRESS, LOTTERY_ABI } from '@/app/constants/contract';

export const SUBMITTED_NUMBERS_KEY = 'lotto_submitted_numbers';

export default function TicketForm() {
  const { address } = useAccount();
  const [numbers, setNumbers] = useState<number[]>(Array(7).fill(0));
  const [error, setError] = useState<string>('');
  const successRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<HTMLDivElement>(null);

  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: hasPlayerBought, isLoading: isCheckingBought, refetch: refetchBought } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'hasPlayerBought',
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (!isConfirmed) return;
    const animate = async () => {
      const { gsap } = await import('gsap');
      if (successRef.current) {
        gsap.fromTo(successRef.current,
          { scale: 0.8, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
        );
      }
    };
    animate();
    refetchBought();
  }, [isConfirmed]);

  useEffect(() => {
    const animate = async () => {
      const { gsap } = await import('gsap');
      if (ballsRef.current) {
        gsap.fromTo(ballsRef.current.querySelectorAll('input'),
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
        );
      }
    };
    animate();
  }, []);

  const handleNumberChange = (index: number, value: number) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const generateRandom = () => {
    const pool: number[] = [];
    while (pool.length < 7) {
      const n = Math.floor(Math.random() * 49) + 1;
      if (!pool.includes(n)) pool.push(n);
    }
    setNumbers(pool.sort((a, b) => a - b));
  };

  const handleBuyTicket = async () => {
    setError('');
    if (numbers.some(n => n < 1 || n > 49)) { setError('All numbers must be between 1 and 49'); return; }
    if (new Set(numbers).size !== 7) { setError('All numbers must be unique'); return; }

    const sorted = [...numbers].sort((a, b) => a - b);
    sessionStorage.setItem(SUBMITTED_NUMBERS_KEY, JSON.stringify(sorted));

    try {
      writeContract({
        address: LOTTERY_ADDRESS,
        abi: LOTTERY_ABI,
        functionName: 'buyTicket',
        args: [sorted] as any,
        value: parseEther('0.01'),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to buy ticket');
    }
  };

  if (isConfirmed) {
    const saved = sessionStorage.getItem(SUBMITTED_NUMBERS_KEY);
    const savedNums: number[] = saved ? JSON.parse(saved) : [];
    return (
      <div ref={successRef} className="text-center">
        <div className="py-8 sm:py-12 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-xl border border-green-400/50 p-5 sm:p-6">
          <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-3">
            TICKET PURCHASED!
          </h3>
          <div className="flex gap-2 justify-center flex-wrap mt-4">
            {savedNums.map((n, i) => (
              <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-black text-white text-sm border-2 border-cyan-300/50">
                {n}
              </div>
            ))}
          </div>
          <p className="text-cyan-300/50 text-xs mt-5 uppercase tracking-wider font-mono break-all px-2">
            {hash?.slice(0, 10)}...{hash?.slice(-8)}
          </p>
        </div>
      </div>
    );
  }

  if (hasPlayerBought && !isConfirmed) {
    const saved = sessionStorage.getItem(SUBMITTED_NUMBERS_KEY);
    const savedNums: number[] = saved ? JSON.parse(saved) : [];
    return (
      <div className="text-center">
        <div className="py-8 sm:py-12 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl border border-orange-400/50 p-5 sm:p-6">
          <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 mb-3">
            YOU'RE IN THE DRAW!
          </h3>
          {savedNums.length > 0 && (
            <div className="flex gap-2 justify-center flex-wrap mt-4">
              {savedNums.map((n, i) => (
                <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-black text-white text-sm border-2 border-orange-300/50">
                  {n}
                </div>
              ))}
            </div>
          )}
          <p className="text-orange-300/60 text-sm mt-5 uppercase tracking-wider">
            Results appear automatically after the draw
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div ref={ballsRef} className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
        {numbers.map((num, index) => (
          <div key={index} className="relative">
            <input
              type="number"
              min="1"
              max="49"
              value={num || ''}
              onChange={(e) => handleNumberChange(index, parseInt(e.target.value) || 0)}
              placeholder={`${index + 1}`}
              disabled={isPending || isConfirming || isCheckingBought}
              className="w-full h-14 sm:h-16 bg-gradient-to-br from-cyan-600/40 to-purple-600/40 border-2 border-cyan-400/60 rounded-xl text-center text-lg sm:text-xl font-black text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan-300/80"
            />
            <label className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-cyan-400/50 tracking-wider">
              #{index + 1}
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-8 justify-center">
        <button
          onClick={generateRandom}
          disabled={isPending || isConfirming || isCheckingBought}
          className="px-4 sm:px-5 py-2 bg-gradient-to-r from-purple-600/60 to-pink-600/60 border border-purple-400/60 rounded-lg text-sm font-bold text-white hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          Random
        </button>
        <button
          onClick={() => setNumbers(Array(7).fill(0))}
          disabled={isPending || isConfirming || isCheckingBought}
          className="px-4 sm:px-5 py-2 bg-gradient-to-r from-gray-600/60 to-gray-700/60 border border-gray-400/60 rounded-lg text-sm font-bold text-white hover:from-gray-500 hover:to-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="p-4 bg-gradient-to-r from-red-500/30 to-pink-500/30 border-2 border-red-400/60 rounded-lg text-red-200 text-sm font-semibold">
          {error}
        </div>
      )}

      {isPending && (
        <div className="p-4 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/60 rounded-lg text-yellow-200 text-sm font-semibold">
          Waiting for wallet confirmation...
        </div>
      )}

      {isConfirming && (
        <div className="p-4 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/60 rounded-lg text-cyan-200 text-sm font-semibold">
          Confirming onchain...
        </div>
      )}

      <button
        onClick={handleBuyTicket}
        disabled={isPending || isConfirming || isCheckingBought || !!hasPlayerBought}
        className="w-full py-4 sm:py-5 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-xl font-black text-white text-base sm:text-lg hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 hover:shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider border-2 border-pink-400/50 hover:border-pink-300"
      >
        {isCheckingBought ? 'Checking...'
          : isPending ? 'Confirm in Wallet...'
          : isConfirming ? 'Processing...'
          : hasPlayerBought ? 'Already in draw'
          : 'BUY TICKET — 0.01 ETH'}
      </button>
    </div>
  );
}