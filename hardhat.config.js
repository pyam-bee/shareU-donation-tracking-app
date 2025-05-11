require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: ["0xdcd69c5cbe68fadb9d32f31798fd987c89621386e78911a35740202a0d130136"],
    },
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  }
};