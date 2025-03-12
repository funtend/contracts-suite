import * as fs from "fs"
import { ethers } from "hardhat"
import * as path from "path"

// SYSTEM START
const HUB_MUMBAI = "0x4fbffF20302F3326B20052ab9C217C44F6480900" // By Lens
const HUB = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d" // By Lens
const MODULE_MUMBAI = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0" // By Lens
const MODULE = "0x1eD5983F0c883B96f7C35528a1e22EEA67DE3Ff9" // By Lens
// SYSTEM END

// KLEPON START
const KLEPON_IPFS = "ipfs://QmcA6Ezbc38wYzFNadHxaCmoogrGcvyiwpLbDGBVQHoiww" // KleponOpenAction - IPFS
// KLEPON END

const main = async () => {
  try {
    // Read Contracts
    const KleponAccessControl = await ethers.getContractFactory(
      "KleponAccessControl"
    )
    const KleponEscrow = await ethers.getContractFactory("KleponEscrow")
    const KleponMetrics = await ethers.getContractFactory("KleponMetrics")
    const KleponNFTCreator = await ethers.getContractFactory("KleponNFTCreator")
    const KleponMissionData =
      await ethers.getContractFactory("KleponMissionData")
    const KleponMilestoneCheckLogic = await ethers.getContractFactory(
      "KleponMilestoneCheckLogic"
    )
    const KleponOpenAction = await ethers.getContractFactory("KleponOpenAction")

    // Deploy Contracts
    const kleponAccessControl = await KleponAccessControl.deploy()
    const kleponMilestoneCheckLogic = await KleponMilestoneCheckLogic.deploy()
    const kleponMissionData = await KleponMissionData.deploy()
    const kleponNFTCreator = await KleponNFTCreator.deploy()
    const kleponEscrow = await KleponEscrow.deploy()
    const kleponMetrics = await KleponMetrics.deploy()
    const kleponOpenAction = await KleponOpenAction.deploy(
      KLEPON_IPFS,
      kleponEscrow.address,
      kleponMissionData.address,
      kleponAccessControl.address,
      kleponMetrics.address,
      kleponNFTCreator.address,
      HUB, // LensHub
      MODULE, // ModuleRegistry
      kleponMilestoneCheckLogic.address
    )

    // Wait Contracts Index
    const WAIT_BLOCK_CONFIRMATIONS = 20
    kleponAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    kleponEscrow.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    kleponMetrics.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    kleponOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    kleponNFTCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    kleponMilestoneCheckLogic.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    kleponMissionData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)

    // Display Deployed Contracts Address
    console.log(
      `kleponAccessControl deployed at\n${kleponAccessControl.address}`
    )
    console.log(`kleponEscrow deployed at\n${kleponEscrow.address}`)
    console.log(`kleponMetrics deployed at\n${kleponMetrics.address}`)
    console.log(`kleponMissionData deployed at\n${kleponMissionData.address}`)
    console.log(`kleponNFTCreator deployed at\n${kleponNFTCreator.address}`)
    console.log(
      `kleponMilestoneLogic deployed at\n${kleponMilestoneCheckLogic.address}`
    )
    console.log(`kleponOpenAction deployed at\n${kleponOpenAction.address}`)

    // Save Data to JSON
    const storagePath = path.join(
      __dirname,
      "../../../storage/funland/klepon-actions.json"
    )

    const dataToSave = [
      {
        kleponAccessControl: kleponAccessControl.address,
        kleponEscrow: kleponEscrow.address,
        kleponMetrics: kleponMetrics.address,
        kleponMissionData: kleponMissionData.address,
        kleponNFTCreator: kleponNFTCreator.address,
        kleponMilestoneCheckLogic: kleponMilestoneCheckLogic.address
      },
      {
        kleponOpenAction: kleponOpenAction.address
      },
      {
        hub: HUB,
        moduleGlobals: MODULE
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
