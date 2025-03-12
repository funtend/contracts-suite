import * as fs from "fs"
import { ethers } from "hardhat"
import * as path from "path"

// SYSTEM START
const HUB_MUMBAI = "0x4fbffF20302F3326B20052ab9C217C44F6480900" // By Lens
const HUB = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d" // By Lens
const MODULE_MUMBAI = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0" // By Lens
const MODULE = "0x1eD5983F0c883B96f7C35528a1e22EEA67DE3Ff9" // By Lens
const ROUTER_MUMBAI = "0xE592427A0AEce92De3Edee1F18E0157C05861564" // Uniswap V3 Router
const ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564" // Uniswap V3 Router
// SYSTEM END

// PIXEL START
const PIXEL_SPLITS_DATA = "0x7a5eF54253ed8DBb02eE3A5Cf215ba612BEf8cf8" // PixelSplitsData - Polygon
const PIXEL_DESIGN_DATA = "0x8436FbbD8bb753D8D0bdb98762Dff1F20f2feFbd" // PixelDesignData - Polygon
const MARKET_CREATOR = "0x384fa5E4655f9A1cF3Db04612F4001CFcB6be052" // MarketCreator - Polygon
// PIXEL END

// NEON START
const NEON_IPFS = "ipfs://QmdtxjbpKpANh8nHHJEsoo9NPTJk1WD2KNbbF69mapViYP" // NeonOpenAction - IPFS
// NEON END

const main = async () => {
  try {
    // Read Contracts
    const MachineAccessControl = await ethers.getContractFactory(
      "MachineAccessControl"
    )
    const NeonAccessControl =
      await ethers.getContractFactory("NeonAccessControl")
    const NeonMachineCreditSwap = await ethers.getContractFactory(
      "NeonMachineCreditSwap"
    )
    const NeonMilestoneEscrow = await ethers.getContractFactory(
      "NeonMilestoneEscrow"
    )
    const NeonData = await ethers.getContractFactory("NeonData")
    const NeonOpenAction = await ethers.getContractFactory("NeonOpenAction")

    // Deploy Contracts
    const machineAccessControl = await MachineAccessControl.deploy()
    const neonMachineCreditSwap = await NeonMachineCreditSwap.deploy(
      machineAccessControl.address,
      ROUTER
    )
    const neonAccessControl = await NeonAccessControl.deploy()
    const neonData = await NeonData.deploy(neonAccessControl.address)
    const neonMilestoneEscrow = await NeonMilestoneEscrow.deploy(
      neonData.address,
      neonAccessControl.address,
      neonMachineCreditSwap.address
    )
    const neonOpenAction = await NeonOpenAction.deploy(
      NEON_IPFS, // NeonOpenAction - IPFS
      HUB,
      MODULE,
      neonAccessControl.address,
      PIXEL_SPLITS_DATA, // PixelSplitsData
      PIXEL_DESIGN_DATA, // PixelDesignData
      MARKET_CREATOR, // MarketCreator
      neonMilestoneEscrow.address,
      neonData.address
    )

    // Wait Contracts Index
    const WAIT_BLOCK_CONFIRMATIONS = 20
    machineAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    neonData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    neonMilestoneEscrow.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    neonMachineCreditSwap.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    neonAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    neonOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)

    // Display Deployed Contracts Address
    console.log(
      `MachineAccessControl deployed at\n${machineAccessControl.address}`
    )
    console.log(
      `MachineCreditSwap deployed at\n${neonMachineCreditSwap.address}`
    )
    console.log(`NeonAccessControl deployed at\n${neonAccessControl.address}`)
    console.log(`NeonData deployed at\n${neonData.address}`)
    console.log(
      `NeonMilestoneEscrow deployed at\n${neonMilestoneEscrow.address}`
    )
    console.log(`NeonOpenAction deployed at\n${neonOpenAction.address}`)

    // Save Data to JSON
    const storagePath = path.join(
      __dirname,
      "../../../storage/funland/neon-actions.json"
    )

    const dataToSave = [
      {
        machineAccessControl: machineAccessControl.address,
        neonAccessControl: neonAccessControl.address,
        neonData: neonData.address,
        neonMilestoneEscrow: neonMilestoneEscrow.address,
        neonMachineCreditSwap: neonMachineCreditSwap.address
      },
      {
        neonOpenAction: neonOpenAction.address
      },
      {
        hub: HUB,
        moduleGlobals: MODULE,
        router: ROUTER
      }
    ]

    fs.writeFileSync(
      storagePath,
      JSON.stringify(dataToSave, null, 2).replace(/\r\n/g, "\n") + "\n"
    )

    console.log(`Addresses have been saved to ${storagePath}`)
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
