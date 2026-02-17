'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'ethers';
import { LOTTERY_ADDRESS, LOTTERY_ABI } from '@/app/constants/contract';

export default function TicketForm() {
  const { address } = useAccount();
  const [numbers, setNumbers] = useState<number[]>(Array(7).fill(0));
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if current player has already bought a ticket
  const { data: hasPlayerBought, isLoading: isCheckingBought } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'hasPlayerBought',
    args: address ? [address] : undefined,
  });

  const handleNumberChange = (index: number, value: number) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const handleBuyTicket = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (numbers.some(n => n < 1 || n > 49)) {
      setError('All numbers must be between 1 and 49');
      return;
    }

    if (new Set(numbers).size !== 7) {
      setError('All numbers must be unique');
      return;
    }

    try {
      // Convert numbers array to uint8 array format
      const numbersUint8 = numbers.map(n => n);

      writeContract({
        address: LOTTERY_ADDRESS,
        abi: LOTTERY_ABI,
        functionName: 'buyTicket',
        args: [numbersUint8] as any,
        value: parseEther('0.01'), // 0.01 ETH
      });
    } catch (err: any) {
      setError(err.message || 'Failed to buy ticket');
    }
  };

  // Show success message when transaction is confirmed
  if (isConfirmed) {
    return (
      <div className="space-y-6 text-center">
        <div className="py-12 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-xl border border-green-400/50 p-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-2">
            TICKET PURCHASED!
          </h3>
          <p className="text-cyan-200 font-bold text-lg">Your numbers: {numbers.join(', ')}</p>
          <p className="text-cyan-300/70 text-sm mt-3 font-mono">
            TX: {hash?.slice(0, 10)}...{hash?.slice(-8)}
          </p>
        </div>
      </div>
    );
  }

  // Show message if player already has a ticket
  if (hasPlayerBought && isConfirmed === false) {
    return (
      <div className="space-y-6 text-center">
        <div className="py-12 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl border border-orange-400/50 p-6">
          <div className="text-6xl mb-4">🎟️</div>
          <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 mb-2">
            ALREADY IN THE POOL!
          </h3>
          <p className="text-orange-200/80 font-semibold">Each player can only buy one ticket per pool.</p>
          <p className="text-orange-300/70 text-sm mt-4 font-semibold">
            Wait for the next draw to buy another ticket.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Number Inputs */}
      <div className="grid grid-cols-7 gap-3">
        {numbers.map((num, index) => (
          <div key={index} className="relative">
            <input
              type="number"
              min="1"
              max="49"
              value={num}
              onChange={(e) => handleNumberChange(index, parseInt(e.target.value) || 0)}
              placeholder={`${index + 1}`}
              disabled={isPending || isConfirming || isCheckingBought}
              className="w-full h-16 bg-gradient-to-br from-cyan-600/40 to-purple-600/40 border-2 border-cyan-400/60 rounded-xl text-center text-xl font-black text-cyan-200 placeholder-cyan-400/40 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/50 focus:from-pink-600/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan-300/80"
            />
            <label className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-bold text-cyan-400/70 tracking-wider">
              #{index + 1}
            </label>
          </div>
        ))}
      </div>

      {/* Quick Fill Buttons */}
      <div className="flex gap-2 mt-10 flex-wrap justify-center">
        <button
          onClick={() => setNumbers(Array.from({ length: 7 }, () => Math.floor(Math.random() * 49) + 1))}
          disabled={isPending || isConfirming || isCheckingBought}
          className="px-4 py-2 bg-gradient-to-r from-purple-600/60 to-pink-600/60 border border-purple-400/60 rounded-lg text-sm font-bold text-white hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          🎲 Random
        </button>
        <button
          onClick={() => setNumbers(Array(7).fill(0))}
          disabled={isPending || isConfirming || isCheckingBought}
          className="px-4 py-2 bg-gradient-to-r from-gray-600/60 to-gray-700/60 border border-gray-400/60 rounded-lg text-sm font-bold text-white hover:from-gray-500 hover:to-gray-600 hover:shadow-lg hover:shadow-gray-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          ✕ Clear
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-gradient-to-r from-red-500/30 to-pink-500/30 border-2 border-red-400/60 rounded-lg text-red-200 text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Transaction Status */}
      {isPending && (
        <div className="p-4 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/60 rounded-lg text-yellow-200 text-sm font-semibold">
          ⏳ Waiting for wallet confirmation...
        </div>
      )}

      {isConfirming && (
        <div className="p-4 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/60 rounded-lg text-cyan-200 text-sm font-semibold">
          🔄 Confirming transaction on blockchain...
        </div>
      )}

      {/* Buy Button */}
      <button
        onClick={handleBuyTicket}
        disabled={isPending || isConfirming || isCheckingBought || hasPlayerBought}
        className="w-full py-5 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-xl font-black text-white text-lg hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 hover:shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider border-2 border-pink-400/50 hover:border-pink-300"
      >
        {isCheckingBought ? 'Checking...' : isPending ? 'Confirm in Wallet...' : isConfirming ? 'Processing...' : hasPlayerBought ? 'Already have ticket' : '🎰 BUY TICKET (0.01 ETH)'}
      </button>

      {/* Info Text */}
      <p className="text-xs text-cyan-200/70 text-center font-semibold uppercase tracking-wider">
        Pick 7 unique numbers between 1-49. Numbers must match sequentially to win.
      </p>
    </div>
  );
}
