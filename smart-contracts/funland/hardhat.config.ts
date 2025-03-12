import "@nomicfoundation/hardhat-verify"
import "@nomiclabs/hardhat-ethers"
import { vars } from "hardhat/config"

require("dotenv").config({ path: ".env" })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    mumbai: {
      url: process.env.MUMBAI_URL_RPC || "",
      accounts:
        process.env.ACCOUNT_PRIVATE_KEY !== undefined
          ? [process.env.ACCOUNT_PRIVATE_KEY]
          : []
    },
    polygon: {
      url: process.env.POLYGON_URL_RPC || "",
      accounts:
        process.env.ACCOUNT_PRIVATE_KEY !== undefined
          ? [process.env.ACCOUNT_PRIVATE_KEY]
          : []
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: "JD1SVP4P11I666UFY4HYYACBDYT6SE698J",
      polygon: "JD1SVP4P11I666UFY4HYYACBDYT6SE698J"
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}
