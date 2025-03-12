import { run } from "hardhat"

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
const BLANKON_OPEN = "0x897Af7e022cAA4B323C6d2E4e1Fcf38E43c55AB0" // BlankonOpenAction - Polygon
const CANVAS_OPEN = "0x8c14587fE3444F1312a5A4AC254F6d3eb3930034" // CanvasOpenAction - Polygon
const MOKA_OPEN = "0xdf5FcD544d55104619c1e8327B053BFf28d5e4f6" // MOKAOpenAction - Polygon
const LITZY_OPEN = "0xdD3Cf2205f66bbcBa43f77481e9D3C64eB742eBf" // LitzyOpenAction - Polygon

const BLANKON_IPFS = "ipfs://QmY2qg5KmfZHKduqkkSDyyFWXLAnEaS5idpJy4Mgry29Dm" // BlankonOpenAction - IPFS
const CANVAS_IPFS = "ipfs://QmYpvM3uWfuh5vmaLpEbQfaUcmSZTREwmbonPt6fsM9fYa" // CanvasOpenAction - IPFS
const MOKA_IPFS = "ipfs://QmRoRAZwc6GK1dvDi3qHvZtMgbio1VPBw4MYUS8Bqo4315" // MOKAOpenAction - IPFS
const LITZY_IPFS = "ipfs://QmeTfNGb4VdPZxussJekqGQYbgx7rn78moMgEyYtuUoZSw" // LitzyOpenAction - IPFS
// OPEN ACTIONS END

const main = async () => {
  try {
    await run(`verify:verify`, {
      address: BLANKON_OPEN, // BlankonOpenAction
      constructorArguments: [
        BLANKON_IPFS, // BlankonOpenAction - IPFS
        HUB,
        MODULE,
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        PIXEL_SPLITS_DATA, // PixelSplitsData
        PIXEL_DESIGN_DATA, // PixelDesignData
        MARKET_CREATOR, // MarketCreator
        COLLECTION_CREATOR, // CollectionCreator
        PIXEL_COMMUNITY_DATA // PixelCommunityData
      ]
    })
    await run(`verify:verify`, {
      address: CANVAS_OPEN, // CanvasOpenAction
      constructorArguments: [
        CANVAS_IPFS, // CanvasOpenAction - IPFS
        HUB,
        MODULE,
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        PIXEL_SPLITS_DATA, // PixelSplitsData
        PIXEL_DESIGN_DATA, // PixelDesignData
        MARKET_CREATOR, // MarketCreator
        COLLECTION_CREATOR, // CollectionCreator
        PIXEL_COMMUNITY_DATA // PixelCommunityData
      ]
    })
    await run(`verify:verify`, {
      address: MOKA_OPEN, // MOKAOpenAction
      constructorArguments: [
        MOKA_IPFS, // MOKAOpenAction - IPFS
        HUB,
        MODULE,
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        PIXEL_SPLITS_DATA, // PixelSplitsData
        PIXEL_DESIGN_DATA, // PixelDesignData
        MARKET_CREATOR, // MarketCreator
        COLLECTION_CREATOR, // CollectionCreator
        PIXEL_COMMUNITY_DATA // PixelCommunityData
      ]
    })
    await run(`verify:verify`, {
      address: LITZY_OPEN, // LitzyOpenAction
      constructorArguments: [
        LITZY_IPFS, // LitzyOpenAction - IPFS
        HUB,
        MODULE,
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        PIXEL_SPLITS_DATA, // PixelSplitsData
        PIXEL_DESIGN_DATA, // PixelDesignData
        MARKET_CREATOR, // MarketCreator
        COLLECTION_CREATOR, // CollectionCreator
        PIXEL_COMMUNITY_DATA // PixelCommunityData
      ]
    })
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
