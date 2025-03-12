import { run } from "hardhat"

// SYSTEM START
const HUB_MUMBAI = "0x4fbffF20302F3326B20052ab9C217C44F6480900" // By Lens
const HUB = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d" // By Lens
const MODULE_MUMBAI = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0" // By Lens
const MODULE = "0x1eD5983F0c883B96f7C35528a1e22EEA67DE3Ff9" // By Lens
// SYSTEM END

// KLEPON START
const KLEPON_ACCESS_CONTROL = "0x3fB0AD37218Eb0E83dA744FF8563b411D411A372" // kleponAccessControl - Polygon
const KLEPON_ESCROW = "0x3ab91663c88ec95195f23ed54772C25EB819a362" // kleponEscrow - Polygon
const KLEPON_METRICS = "0x1C624654E9834Ce0d33B0D3ed7a6B46B9109F293" // kleponMetrics - Polygon
const KLEPON_MISSION_DATA = "0x8761BeCa5d71662e99483F86567bF348f579F52d" // kleponMissionData - Polygon
const KLEPON_MILESTONE_CHECK_LOGIC =
  "0x1e916e56dcBD5c13eBbBA3666E9f2d99616d5adE" // kleponMilestoneCheckLogic - Polygon
const KLEPON_NFT_CREATOR = "0x4D94B48fE1A91a2fA5Ff4201ba9c567a3C94ae3B" // kleponNFTCreator - Polygon
const KLEPON_OPEN = "0xD02505f3b126b6D81b1140c5e8a620ebE9Ed02b9" // KleponOpenAction - Polygon
const KLEPON_IPFS = "ipfs://QmcA6Ezbc38wYzFNadHxaCmoogrGcvyiwpLbDGBVQHoiww" // KleponOpenAction - IPFS
// KLEPON END

const main = async () => {
  try {
    await run(`verify:verify`, {
      address: KLEPON_ACCESS_CONTROL, // kleponAccessControl
      constructorArguments: []
    })
    await run(`verify:verify`, {
      address: KLEPON_ESCROW, // kleponEscrow
      constructorArguments: []
    })
    await run(`verify:verify`, {
      address: KLEPON_METRICS, // kleponMetrics
      constructorArguments: []
    })
    await run(`verify:verify`, {
      address: KLEPON_MISSION_DATA, // kleponMissionData
      constructorArguments: []
    })
    await run(`verify:verify`, {
      address: KLEPON_MILESTONE_CHECK_LOGIC, // kleponMilestoneCheckLogic
      constructorArguments: []
    })
    await run(`verify:verify`, {
      address: KLEPON_NFT_CREATOR, // kleponNFTCreator
      constructorArguments: []
    })

    await run(`verify:verify`, {
      address: KLEPON_OPEN, // kleponOpenAction
      constructorArguments: [
        KLEPON_IPFS, // KleponOpenAction - IPFS
        KLEPON_ESCROW, // kleponEscrow
        KLEPON_MISSION_DATA, // kleponMissionData
        KLEPON_ACCESS_CONTROL, // kleponAccessControl
        KLEPON_METRICS, // kleponMetrics
        KLEPON_NFT_CREATOR, // kleponNFTCreator
        HUB, // LensHub
        MODULE, // ModuleRegistry
        KLEPON_MILESTONE_CHECK_LOGIC // kleponMilestoneCheckLogic
      ]
    })
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
