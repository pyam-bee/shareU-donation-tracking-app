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
      accounts: ["0x437da4ecded8847be1a7047b281ebbcce6c184afd3a395b91d0bf244004839ba"],
    },
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  }
};