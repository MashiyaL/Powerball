'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'ethers';
import TicketForm from './TicketForm';
import PrizePool from './PrizePool';
import WinningNumbers from './WinningNumbers';
import { LOTTERY_ADDRESS, LOTTERY_ABI } from '@/app/constants/contract';

export default function LotteryGame() {
  const { address, isConnected } = useAccount();

  // Read prize pool from contract
  const { data: prizePoolData, isLoading: isPoolLoading } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'prizePool',
  });

  // Read winning numbers from contract
  const { data: winningNumbersData, isLoading: isNumbersLoading } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'lastWinningNumbers',
  });

  // Read all players in the pool
  const { data: playersData, isLoading: isPlayersLoading } = useReadContract({
    address: LOTTERY_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'getPlayers',
  });

  // Format prize pool to ETH
  const prizePool = prizePoolData ? formatEther(prizePoolData as bigint) : '0';

  // Convert winning numbers to regular numbers array
  const winningNumbers = winningNumbersData
    ? Array.from(winningNumbersData as readonly number[]).map(n => Number(n))
    : [];

  // Convert players data
  const players = playersData ? Array.from(playersData as readonly string[]) : [];

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-purple-200">Please connect your wallet to play</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Game Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Buy Ticket Card */}
        <div className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-xl p-8 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-6">🎫 Buy Ticket</h2>
          <TicketForm />
        </div>

        {/* Winning Numbers Card */}
        <div className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-xl p-8 border border-pink-500/30 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 mb-6">🎯 Latest Winning Numbers</h2>
          {isNumbersLoading ? (
            <div className="text-cyan-300 text-center py-8">Loading numbers...</div>
          ) : (
            <WinningNumbers numbers={winningNumbers} />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Prize Pool Card */}
        <div className="bg-gradient-to-br from-yellow-600/20 via-pink-600/20 to-purple-600/20 rounded-xl p-8 border border-yellow-400/50 backdrop-blur-xl shadow-2xl shadow-yellow-500/30">
          <h3 className="text-lg font-semibold text-yellow-300 mb-2 tracking-widest">💰 PRIZE POOL</h3>
          {isPoolLoading ? (
            <div className="text-yellow-300">Loading...</div>
          ) : (
            <>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 mb-2">
                {parseFloat(prizePool).toFixed(4)}
              </div>
              <p className="text-yellow-200/70 text-sm">ETH</p>
              <p className="text-yellow-200/60 text-xs mt-3 font-semibold">Total winnings available</p>
            </>
          )}
        </div>

        {/* Players in Pool Card */}
        <div className="bg-gradient-to-br from-gray-900 via-cyan-900/50 to-gray-900 rounded-xl p-6 border border-cyan-500/40 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 tracking-wide">👥 PLAYERS ({players.length})</h3>
          {isPlayersLoading ? (
            <div className="text-cyan-300 text-sm">Loading players...</div>
          ) : players.length === 0 ? (
            <p className="text-cyan-200/60 text-sm">No players yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-400/30 hover:border-cyan-400/60 transition-all hover:bg-cyan-500/20 cursor-pointer"
                >
                  <p className="text-xs text-cyan-300 font-mono break-all font-semibold">{player}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connected Address */}
        <div className="bg-gradient-to-br from-gray-900 via-pink-900/50 to-gray-900 rounded-xl p-6 border border-pink-500/40 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
          <p className="text-xs text-pink-300/70 mb-2 uppercase tracking-widest font-bold">Your Address</p>
          {isConnected && address ? (
            <p className="text-sm font-mono text-pink-300 break-all bg-pink-500/10 p-3 rounded-lg border border-pink-400/30">{address}</p>
          ) : (
            <p className="text-sm text-pink-300/60">Not connected</p>
          )}
        </div>
      </div>
    </div>
  );
}
