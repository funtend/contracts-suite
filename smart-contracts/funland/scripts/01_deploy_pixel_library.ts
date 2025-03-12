import * as fs from "fs"
import { ethers } from "hardhat"
import * as path from "path"

const PKP_FIAT = "0x15584102a2b2300aa3acc1d4aa1548cf679453f5" // Funtend Wallet

const main = async () => {
  try {
    // Read Contracts
    const PixelAccessControl =
      await ethers.getContractFactory("PixelAccessControl")
    const PixelDesignData = await ethers.getContractFactory("PixelDesignData")
    const PixelOrderData = await ethers.getContractFactory("PixelOrderData")
    const PixelSplitsData = await ethers.getContractFactory("PixelSplitsData")
    const NFTCreator = await ethers.getContractFactory("NFTCreator")
    const CollectionCreator =
      await ethers.getContractFactory("CollectionCreator")
    const MarketCreator = await ethers.getContractFactory("MarketCreator")
    const PixelCommunityData =
      await ethers.getContractFactory("PixelCommunityData")
    const CommunityCreator = await ethers.getContractFactory("CommunityCreator")

    // Deploy Contracts
    const pixelAccessControl = await PixelAccessControl.deploy()
    const pixelDesignData = await PixelDesignData.deploy(
      pixelAccessControl.address
    )
    const pixelOrderData = await PixelOrderData.deploy(
      pixelAccessControl.address,
      pixelDesignData.address
    )
    const pixelSplitsData = await PixelSplitsData.deploy(
      pixelAccessControl.address
    )
    const nFTCreator = await NFTCreator.deploy(
      pixelDesignData.address,
      pixelAccessControl.address
    )
    const collectionCreator = await CollectionCreator.deploy(
      nFTCreator.address,
      pixelDesignData.address,
      pixelAccessControl.address,
      pixelSplitsData.address
    )
    const marketCreator = await MarketCreator.deploy(
      pixelAccessControl.address, // PixelAccessControl - Polygon
      pixelSplitsData.address, // PixelSplitsData - Polygon
      pixelOrderData.address, // PixelOrderData - Polygon
      collectionCreator.address, // CollectionCreator - Polygon
      pixelDesignData.address, // PixelDesignData - Polygon
      PKP_FIAT
    )
    const communityCreator = await CommunityCreator.deploy(
      pixelOrderData.address, // PixelOrderData - Polygon
      pixelAccessControl.address, // PixelAccessControl - Polygon
      pixelDesignData.address // PixelDesignData - Polygon
    )
    const pixelCommunityData = await PixelCommunityData.deploy(
      pixelAccessControl.address, // PixelAccessControl - Polygon
      communityCreator.address
    )

    // Wait Contracts Index
    const WAIT_BLOCK_CONFIRMATIONS = 20
    pixelAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    pixelDesignData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    pixelOrderData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    pixelSplitsData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    nFTCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    collectionCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    marketCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    communityCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    pixelCommunityData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)

    // Display Deployed Contracts Address
    console.log(`PixelAccessControl deployed at\n${pixelAccessControl.address}`)
    console.log(`PixelDesignData deployed at\n${pixelDesignData.address}`)
    console.log(`PixelOrderData deployed at\n${pixelOrderData.address}`)
    console.log(`PixelSplitsData deployed at\n${pixelSplitsData.address}`)
    console.log(`NFTCreator deployed at\n${nFTCreator.address}`)
    console.log(`CollectionCreator deployed at\n${collectionCreator.address}`)
    console.log(`MarketCreator deployed at\n${marketCreator.address}`)
    console.log(`CommunityCreator deployed at\n${communityCreator.address}`)
    console.log(`PixelCommunityData deployed at\n${pixelCommunityData.address}`)

    // Save Data to JSON
    const storagePath = path.join(
      __dirname,
      "../../../storage/funland/pixel-library.json"
    )

    const dataToSave = [
      {
        pixelAccess: pixelAccessControl.address,
        pixelDesign: pixelDesignData.address,
        pixelCommunity: pixelCommunityData.address,
        pixelOrder: pixelOrderData.address,
        pixelSplit: pixelSplitsData.address,
        nftCreator: nFTCreator.address,
        collectionCreator: collectionCreator.address,
        marketCreator: marketCreator.address,
        communityCreator: communityCreator.address
      },
      {
        fiatPKPAddress: PKP_FIAT
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
