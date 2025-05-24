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
      accounts: ["0x341757c969001e00aa7a923680b3de1119327927b1a11f6ea3d042b0db1a1fe8"],
    },
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  }
};