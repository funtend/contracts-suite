import { run } from "hardhat"

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
const MACHINE_ACCESS_CONTROL = "0x6367C624F1dcD6Dbd6D004ac43b6B17670867635" // MachineAccessControl - Polygon
const NEON_ACCESS_CONTROL = "0xD99a8843bc5176857d9071ec0d07E56de7B26d6A" // NeonAccessControl - Polygon
const NEON_DATA = "0xc31f49140a8723D141eB92F7e60CD661d392e988" // NeonData - Polygon
const NEON_MACHINE_CREDIT_SWAP = "0xA75c3d18Fa4B8827f3f41334e52169a41a7791C4" // NeonMachineCreditSwap - Polygon
const NEON_MILESTONE_ESCROW = "0x2E572EBB9a1CEd7a8520a82a7c30d4f0e7A0B525" // NeonMilestoneEscrow - Polygon
const NEON_OPEN = "0x6F32bfd394eC76eE6d1f416228DeF531170d50cf" // NeonOpenAction - Polygon
const NEON_IPFS = "ipfs://QmdtxjbpKpANh8nHHJEsoo9NPTJk1WD2KNbbF69mapViYP" // NeonOpenAction - IPFS
// NEON END

const main = async () => {
  try {
    await run(`verify:verify`, {
      address: NEON_DATA, // NeonData
      constructorArguments: [
        NEON_ACCESS_CONTROL // NeonAccessControl
      ]
    })
    await run(`verify:verify`, {
      address: NEON_ACCESS_CONTROL, // NeonAccessControl
      constructorArguments: []
    })
    await run(`verify:verify`, {
      address: MACHINE_ACCESS_CONTROL, // MachineAccessControl
      constructorArguments: []
    })
    await run(`verify:verify`, {
      address: NEON_MACHINE_CREDIT_SWAP, // NeonMachineCreditSwap
      constructorArguments: [
        MACHINE_ACCESS_CONTROL, // MachineAccessControl
        ROUTER
      ]
    })
    await run(`verify:verify`, {
      address: NEON_MILESTONE_ESCROW, // NeonMilestoneEscrow
      constructorArguments: [
        NEON_DATA, // NeonData
        NEON_ACCESS_CONTROL, // NeonAccessControl
        NEON_MACHINE_CREDIT_SWAP // NeonMachineCreditSwap
      ]
    })
    await run(`verify:verify`, {
      address: NEON_OPEN, // NeonOpenAction
      constructorArguments: [
        NEON_IPFS, // NeonOpenAction - IPFS
        HUB,
        MODULE,
        NEON_ACCESS_CONTROL, // NeonAccessControl
        PIXEL_SPLITS_DATA, // PixelSplitsData
        PIXEL_DESIGN_DATA, // PixelDesignData
        MARKET_CREATOR, // MarketCreator
        NEON_MILESTONE_ESCROW, // NeonMilestoneEscrow
        NEON_DATA // NeonData
      ]
    })
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
