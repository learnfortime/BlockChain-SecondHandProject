require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SPEOLIA_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,  // This is the chain ID for Sepolia
    },
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "5777",
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    }
  }
};