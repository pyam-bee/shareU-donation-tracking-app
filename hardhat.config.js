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
      accounts: ["0xac0d0a4d9b2a8c1415e9c9cd8c44c6340c2646f53f1420072716ee2df200a4c5"],
    },
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  }
};