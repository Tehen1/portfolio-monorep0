require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-verify");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable IR-based codegen for better optimization
    },
  },

  networks: {
    hardhat: {
      forking: {
        enabled: process.env.FORKING === "true",
        url: process.env.ETHEREUM_RPC_URL,
      },
    },

    localhost: {
      url: "http://127.0.0.1:8545",
    },

    scrollSepolia: {
      url: process.env.SCROLL_RPC_URL || "https://sepolia-rpc.scroll.io",
      accounts: [PRIVATE_KEY],
      chainId: 534351,
    },

    polygonZkEVM: {
      url: process.env.POLYGON_ZKEVM_RPC_URL || "https://testnet-rpc.zkevmpolygon.com",
      accounts: [PRIVATE_KEY],
      chainId: 1402,
    },

    ethereumSepolia: {
      url: process.env.ETHEREUM_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/...",
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },

  etherscan: {
    apiKey: {
      scrollSepolia: process.env.ETHERSCAN_API_KEY || "",
      polygonZkEVM: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia-blockscout.scroll.io/api",
          browserURL: "https://sepolia-blockscout.scroll.io"
        }
      }
    ]
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  mocha: {
    timeout: 400000,
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "EUR",
    outputFile: "gas-report.txt",
    noColors: false,
  },

  contractSizer: {
    enabled: process.env.REPORT_SIZE === "true",
    runOnCompile: false,
    disambiguatePaths: false,
  },
};