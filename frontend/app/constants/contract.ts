// Contract addresses and ABIs
export const LOTTERY_ADDRESS = '0x957Cd0286AC4DBF9c550438E4e6955ca55b299e8' as const;

export const LOTTERY_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'subscriptionId', type: 'uint256' },
      { internalType: 'address', name: 'vrfCoordinator', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'uint8[7]', name: '_numbers', type: 'uint8[7]' }],
    name: 'buyTicket',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    name: 'checkUpkeep',
    outputs: [
      { internalType: 'bool', name: 'upkeepNeeded', type: 'bool' },
      { internalType: 'bytes', name: 'performData', type: 'bytes' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'prizePool',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastWinningNumbers',
    outputs: [{ internalType: 'uint8[7]', name: '', type: 'uint8[7]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastDrawTimestamp',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 's_owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'tickets',
    outputs: [
      { internalType: 'address', name: 'player', type: 'address' },
      { internalType: 'uint8[7]', name: 'numbers', type: 'uint8[7]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPlayers',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'player', type: 'address' }],
    name: 'hasPlayerBought',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const;
