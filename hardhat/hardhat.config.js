require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: false
    }
  },

  networks: {
    medichain: {
      url: 'http://127.0.0.1:8545',
      chainId: 12080903,
      accounts: [
        '0x1a586d7e350652b0789777a1505dd4a856cef97bb7b212b050744cee58ccc214'
      ]
    }
  }
};
