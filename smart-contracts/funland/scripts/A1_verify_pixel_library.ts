import { run } from "hardhat"

// SYSTEM START
const PKP_FIAT = "0x15584102a2b2300aa3acc1d4aa1548cf679453f5" // Funtend Wallet
// SYSTEM END

// PIXEL START
const PIXEL_ACCESS_CONTROL = "0x35178430783E07c9a8933bfC61b0C00c9c4860E1" // PixelAccessControl - Polygon
const PIXEL_ORDER_DATA = "0x15c7f9cc23288919e586ABe92013dd23ECB87Cf1" // PixelOrderData - Polygon
const PIXEL_SPLITS_DATA = "0x7a5eF54253ed8DBb02eE3A5Cf215ba612BEf8cf8" // PixelSplitsData - Polygon
const PIXEL_DESIGN_DATA = "0x8436FbbD8bb753D8D0bdb98762Dff1F20f2feFbd" // PixelDesignData - Polygon
const PIXEL_COMMUNITY_DATA = "0xDF427211F145758c1d3BB7652F5bA4633F9C09ee" // PixelCommunityData - Polygon
const NFT_CREATOR = "0x67FF73F5e29D8740edAF590438a5790Af2cd8Be8" // NFTCreator - Polygon
const MARKET_CREATOR = "0x384fa5E4655f9A1cF3Db04612F4001CFcB6be052" // MarketCreator - Polygon
const COLLECTION_CREATOR = "0x5e68C86ab699E996347d4dCe3Cf28934437ea3ab" // CollectionCreator - Polygon
const COMMUNITY_CREATOR = "0x37722096f9f5294AC300F755FCEE73D4Ab655253" // CommunityCreator - Polygon
// PIXEL END

const main = async () => {
  try {
    await run(`verify:verify`, {
      address: PIXEL_ACCESS_CONTROL // PixelAccessControl
    })
    await run(`verify:verify`, {
      address: PIXEL_DESIGN_DATA, // PixelDesignData
      constructorArguments: [
        PIXEL_ACCESS_CONTROL // PixelAccessControl
      ]
    })
    await run(`verify:verify`, {
      address: PIXEL_ORDER_DATA, // PixelOrderData
      constructorArguments: [
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        PIXEL_DESIGN_DATA // PixelDesignData
      ]
    })
    await run(`verify:verify`, {
      address: PIXEL_SPLITS_DATA, // PixelSplitsData
      constructorArguments: [
        PIXEL_ACCESS_CONTROL // PixelAccessControl
      ]
    })
    await run(`verify:verify`, {
      address: NFT_CREATOR, // NFTCreator
      constructorArguments: [
        PIXEL_DESIGN_DATA, // PixelDesignData
        PIXEL_ACCESS_CONTROL // PixelAccessControl
      ]
    })
    await run(`verify:verify`, {
      address: COLLECTION_CREATOR, // CollectionCreator
      constructorArguments: [
        NFT_CREATOR, // NFTCreator
        PIXEL_DESIGN_DATA, // PixelDesignData
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        PIXEL_SPLITS_DATA // PixelSplitsData
      ]
    })
    await run(`verify:verify`, {
      address: MARKET_CREATOR, // MarketCreator
      constructorArguments: [
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        PIXEL_SPLITS_DATA, // PixelSplitsData
        PIXEL_ORDER_DATA, // PixelOrderData
        COLLECTION_CREATOR, // CollectionCreator
        PIXEL_DESIGN_DATA, // PixelDesignData
        PKP_FIAT
      ]
    })
    await run(`verify:verify`, {
      address: COMMUNITY_CREATOR, // CommunityCreator
      constructorArguments: [
        PIXEL_ORDER_DATA, // PixelOrderData
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        PIXEL_DESIGN_DATA // PixelDesignData
      ]
    })

    await run(`verify:verify`, {
      address: PIXEL_COMMUNITY_DATA, // PixelCommunityData
      constructorArguments: [
        PIXEL_ACCESS_CONTROL, // PixelAccessControl
        COMMUNITY_CREATOR // CommunityCreator
      ]
    })
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
