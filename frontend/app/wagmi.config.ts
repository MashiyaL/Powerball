import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Powerball Lottery',
  projectId: '2c6eef5b92780caa693b63f79c81a14f', // Get one from https://cloud.walletconnect.com
  chains: [sepolia],
  ssr: true,
});
