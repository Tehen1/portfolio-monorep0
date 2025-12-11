import { ethers } from 'ethers';

// Contract ABIs (simplified versions)
export const PortfolioTokenABI = [
  // ERC20 standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",

  // Custom functions
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function getStakedBalance(address user) view returns (uint256)",
  "function getRewards(address user) view returns (uint256)",
  "function claimRewards() external",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)"
];

// Contract addresses (these would be deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  // Ethereum Mainnet
  ethereum: {
    PortfolioToken: '0x0000000000000000000000000000000000000000', // Replace with actual address
  },
  // Polygon
  polygon: {
    PortfolioToken: '0x0000000000000000000000000000000000000000', // Replace with actual address
  },
  // zkEVM
  zkevm: {
    PortfolioToken: '0x0000000000000000000000000000000000000000', // Replace with actual address
  }
};

// Network configurations
export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://etherscan.io'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  zkevm: {
    chainId: 1101,
    name: 'zkEVM',
    rpcUrl: 'https://zkevm-rpc.com',
    blockExplorer: 'https://zkevm.polygonscan.com'
  }
};

// Contract helper class
export class PortfolioTokenContract {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(
    contractAddress: string,
    signer: ethers.Signer
  ) {
    this.signer = signer;
    this.contract = new ethers.Contract(contractAddress, PortfolioTokenABI, signer);
  }

  // ERC20 functions
  async balanceOf(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  }

  async transfer(to: string, amount: string): Promise<any> {
    const tx = await this.contract.transfer(to, ethers.utils.parseEther(amount));
    return await tx.wait();
  }

  async approve(spender: string, amount: string): Promise<any> {
    const tx = await this.contract.approve(spender, ethers.utils.parseEther(amount));
    return await tx.wait();
  }

  // Custom functions
  async stake(amount: string): Promise<any> {
    const tx = await this.contract.stake(ethers.utils.parseEther(amount));
    return await tx.wait();
  }

  async unstake(amount: string): Promise<any> {
    const tx = await this.contract.unstake(ethers.utils.parseEther(amount));
    return await tx.wait();
  }

  async getStakedBalance(userAddress: string): Promise<string> {
    const balance = await this.contract.getStakedBalance(userAddress);
    return ethers.utils.formatEther(balance);
  }

  async getRewards(userAddress: string): Promise<string> {
    const rewards = await this.contract.getRewards(userAddress);
    return ethers.utils.formatEther(rewards);
  }

  async claimRewards(): Promise<any> {
    const tx = await this.contract.claimRewards();
    return await tx.wait();
  }

  // Utility functions
  getContract(): ethers.Contract {
    return this.contract;
  }

  getSigner(): ethers.Signer {
    return this.signer;
  }
}

// Factory function to create contract instance
export const createPortfolioTokenContract = (
  contractAddress: string,
  signer: ethers.Signer
): PortfolioTokenContract => {
  return new PortfolioTokenContract(contractAddress, signer);
};

// Get contract address for network
export const getContractAddress = (network: keyof typeof CONTRACT_ADDRESSES): string => {
  return CONTRACT_ADDRESSES[network].PortfolioToken;
};

// Get network config
export const getNetworkConfig = (network: keyof typeof NETWORKS) => {
  return NETWORKS[network];
};

// Web3 utilities
export const web3Utils = {
  // Connect to wallet
  connectWallet: async (): Promise<string | null> => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  },

  // Switch network
  switchNetwork: async (chainId: number): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error: any) {
      // If network doesn't exist, try to add it
      if (error.code === 4902) {
        // Add network logic here if needed
        console.error('Network not found');
      }
      return false;
    }
  },

  // Get current network
  getCurrentNetwork: async (): Promise<number | null> => {
    if (!window.ethereum) return null;

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } catch (error) {
      console.error('Error getting current network:', error);
      return null;
    }
  },

  // Get signer
  getSigner: async (): Promise<ethers.Signer | null> => {
    if (!window.ethereum) return null;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return signer;
    } catch (error) {
      console.error('Error getting signer:', error);
      return null;
    }
  }
};

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
