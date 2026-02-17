# Powerball Lottery Frontend

A modern, sleek Next.js frontend for interacting with the Powerball Lottery smart contract on Sepolia testnet.

## Features

✨ **Modern UI** - Dark theme with gradient backgrounds and smooth animations
🔗 **Wallet Connection** - Connect with RainbowKit & Wagmi
🎰 **Buy Tickets** - Select 7 numbers and purchase lottery tickets
💰 **Prize Pool** - Real-time prize pool display
🎲 **Random Number Generator** - Quick buttons for sequential and random numbers
📊 **Winning Numbers** - Display latest winning numbers

## Quick Start

### Prerequisites
- Node.js 18+
- Sepolia testnet ETH in your wallet

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Get a Wallet Connect Project ID (optional):
   - Go to https://cloud.walletconnect.com
   - Create a new project and copy your Project ID
   - Update `app/wagmi.config.ts` with your Project ID

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Configuration

### Smart Contract
- **Address**: `0x836bE4Ee87B916e5a7318225c41D8A5A0b7279A3`
- **Network**: Sepolia Testnet
- **Ticket Price**: 0.01 ETH

To update the contract address, edit `LOTTERY_ADDRESS` in `app/constants/contract.ts`

## How to Play

1. **Connect Wallet** - Click connect button in top right
2. **Pick Numbers** - Select 7 unique numbers (1-49)
3. **Buy Ticket** - Confirm transaction (0.01 ETH)
4. **Wait for Draw** - Automatic draw every 24 hours
5. **Claim Winnings** - Prizes based on sequential matches:
   - 2 matches: 5%
   - 3 matches: 10%
   - 4 matches: 15%
   - 5-6 matches: 20%
   - 7 matches: 30%

## Technology Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v3, RainbowKit, ethers.js

## Project Structure

```
app/
├── page.tsx              # Main page
├── layout.tsx            # Root layout with Wagmi setup
├── wagmi.config.ts       # Wagmi configuration
└── components/
    ├── LotteryGame.tsx   # Main game component
    ├── TicketForm.tsx    # Number picker form
    ├── WinningNumbers.tsx # Winning numbers display
    └── PrizePool.tsx     # Prize pool display
```

## Next Steps

- [ ] Connect contract read/write functions
- [ ] Display user's purchased tickets
- [ ] Add transaction history
- [ ] Win animations
- [ ] Mobile optimization

## Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Docs](https://www.rainbowkit.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

