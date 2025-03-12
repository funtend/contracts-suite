import * as fs from "fs"
import { ethers } from "hardhat"
import * as path from "path"

// SYSTEM START
const HUB_MUMBAI = "0x4fbffF20302F3326B20052ab9C217C44F6480900" // By Lens
const HUB = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d" // By Lens
const MODULE_MUMBAI = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0" // By Lens
const MODULE = "0x1eD5983F0c883B96f7C35528a1e22EEA67DE3Ff9" // By Lens
// SYSTEM END

// PIXEL START
const PIXEL_ACCESS_CONTROL = "0x35178430783E07c9a8933bfC61b0C00c9c4860E1" // PixelAccessControl - Polygon
const PIXEL_SPLITS_DATA = "0x7a5eF54253ed8DBb02eE3A5Cf215ba612BEf8cf8" // PixelSplitsData - Polygon
const PIXEL_DESIGN_DATA = "0x8436FbbD8bb753D8D0bdb98762Dff1F20f2feFbd" // PixelDesignData - Polygon
const PIXEL_COMMUNITY_DATA = "0xDF427211F145758c1d3BB7652F5bA4633F9C09ee" // PixelCommunityData - Polygon
const MARKET_CREATOR = "0x384fa5E4655f9A1cF3Db04612F4001CFcB6be052" // MarketCreator - Polygon
const COLLECTION_CREATOR = "0x5e68C86ab699E996347d4dCe3Cf28934437ea3ab" // CollectionCreator - Polygon
// PIXEL END

// OPEN ACTIONS START
const BLANKON_IPFS = "ipfs://QmY2qg5KmfZHKduqkkSDyyFWXLAnEaS5idpJy4Mgry29Dm" // BlankonOpenAction - IPFS
const CANVAS_IPFS = "ipfs://QmYpvM3uWfuh5vmaLpEbQfaUcmSZTREwmbonPt6fsM9fYa" // CanvasOpenAction - IPFS
const MOKA_IPFS = "ipfs://QmRoRAZwc6GK1dvDi3qHvZtMgbio1VPBw4MYUS8Bqo4315" // MOKAOpenAction - IPFS
const LITZY_IPFS = "ipfs://QmeTfNGb4VdPZxussJekqGQYbgx7rn78moMgEyYtuUoZSw" // LitzyOpenAction - IPFS
// OPEN ACTIONS END

const main = async () => {
  try {
    // Read Contracts
    const BlankonOpenAction =
      await ethers.getContractFactory("BlankonOpenAction")
    const CanvasOpenAction = await ethers.getContractFactory("CanvasOpenAction")
    const MOKAOpenAction = await ethers.getContractFactory("MOKAOpenAction")
    const LitzyOpenAction = await ethers.getContractFactory("LitzyOpenAction")

    // Deploy Contracts
    const blankonOpenAction = await BlankonOpenAction.deploy(
      BLANKON_IPFS, // BlankonOpenAction - IPFS
      HUB,
      MODULE,
      PIXEL_ACCESS_CONTROL, // PixelAccessControl - Polygon
      PIXEL_SPLITS_DATA, // PixelSplitsData - Polygon
      PIXEL_DESIGN_DATA, // PixelDesignData - Polygon
      MARKET_CREATOR, // MarketCreator - Polygon
      COLLECTION_CREATOR, // CollectionCreator - Polygon
      PIXEL_COMMUNITY_DATA // PixelCommunityData - Polygon
    )
    const canvasOpenAction = await CanvasOpenAction.deploy(
      CANVAS_IPFS, // CanvasOpenAction - IPFS
      HUB,
      MODULE,
      PIXEL_ACCESS_CONTROL, // PixelAccessControl - Polygon
      PIXEL_SPLITS_DATA, // PixelSplitsData - Polygon
      PIXEL_DESIGN_DATA, // PixelDesignData - Polygon
      MARKET_CREATOR, // MarketCreator - Polygon
      COLLECTION_CREATOR, // CollectionCreator - Polygon
      PIXEL_COMMUNITY_DATA // PixelCommunityData - Polygon
    )
    const mokaOpenAction = await MOKAOpenAction.deploy(
      MOKA_IPFS, // MOKAOpenAction - IPFS
      HUB,
      MODULE,
      PIXEL_ACCESS_CONTROL, // PixelAccessControl - Polygon
      PIXEL_SPLITS_DATA, // PixelSplitsData - Polygon
      PIXEL_DESIGN_DATA, // PixelDesignData - Polygon
      MARKET_CREATOR, // MarketCreator - Polygon
      COLLECTION_CREATOR, // CollectionCreator - Polygon
      PIXEL_COMMUNITY_DATA // PixelCommunityData - Polygon
    )
    const litzyOpenAction = await LitzyOpenAction.deploy(
      LITZY_IPFS, // LitzyOpenAction - IPFS
      HUB,
      MODULE,
      PIXEL_ACCESS_CONTROL, // PixelAccessControl - Polygon
      PIXEL_SPLITS_DATA, // PixelSplitsData - Polygon
      PIXEL_DESIGN_DATA, // PixelDesignData - Polygon
      MARKET_CREATOR, // MarketCreator - Polygon
      COLLECTION_CREATOR, // CollectionCreator - Polygon
      PIXEL_COMMUNITY_DATA // PixelCommunityData - Polygon
    )

    // Wait Contracts Index
    const WAIT_BLOCK_CONFIRMATIONS = 20
    blankonOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    mokaOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    litzyOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)

    // Display Deployed Contracts Address
    console.log(`BlankonOpenAction deployed at\n${blankonOpenAction.address}`)
    console.log(`CanvasOpenAction deployed at\n${canvasOpenAction.address}`)
    console.log(`MOKAOpenAction deployed at\n${mokaOpenAction.address}`)
    console.log(`LitzyOpenAction deployed at\n${litzyOpenAction.address}`)

    // Save Data to JSON
    const storagePath = path.join(
      __dirname,
      "../../../storage/funland/open-actions.json"
    )

    const dataToSave = [
      {
        blankonOpenAction: blankonOpenAction.address,
        canvasOpenAction: canvasOpenAction.address,
        mokaOpenAction: mokaOpenAction.address,
        litzyOpenAction: litzyOpenAction.address
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
