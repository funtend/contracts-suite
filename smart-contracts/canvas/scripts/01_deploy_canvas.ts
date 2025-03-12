import * as fs from "fs"
import { ethers } from "hardhat"
import * as path from "path"

const PKP_FIAT = "0x15584102a2b2300aa3acc1d4aa1548cf679453f5" // Funtend Wallet

const main = async () => {
  try {
    // Read Contracts
    const CanvasAccessControl = await ethers.getContractFactory(
      "CanvasAccessControl"
    )
    const CustomCompositeNFT =
      await ethers.getContractFactory("CustomCompositeNFT")
    const CanvasPayment = await ethers.getContractFactory("CanvasPayment")
    const CanvasFulfillment =
      await ethers.getContractFactory("CanvasFulfillment")
    const ChildFGO = await ethers.getContractFactory("CanvasChildFGO")
    const ParentFGO = await ethers.getContractFactory("CanvasParentFGO")
    const CanvasOracle = await ethers.getContractFactory("CanvasOracle")
    const CanvasFGOEscrow = await ethers.getContractFactory("CanvasFGOEscrow")
    const PreRollNFT = await ethers.getContractFactory("PreRollNFT")
    const PreRollCollection =
      await ethers.getContractFactory("PreRollCollection")
    const CanvasMarket = await ethers.getContractFactory("CanvasMarket")
    const CanvasPKPs = await ethers.getContractFactory("CanvasPKPs")
    const CanvasSubscription =
      await ethers.getContractFactory("CanvasSubscription")
    const CanvasPreludePoints = await ethers.getContractFactory(
      "CanvasPreludePoints"
    )

    // Deploy Contracts
    const accessControl = await CanvasAccessControl.deploy(
      "CanvasAccessControl",
      "CVAC"
    )
    const canvasPayment = await CanvasPayment.deploy(
      accessControl.address,
      "CanvasPayment",
      "CVPA"
    )
    const customCompositeNFT = await CustomCompositeNFT.deploy(
      accessControl.address
    )
    const canvasFulfillment = await CanvasFulfillment.deploy(
      accessControl.address,
      "CanvasFulfillment",
      "CVFU"
    )
    const childFGO = await ChildFGO.deploy(
      "CanvasChildFGO",
      "CVCFGO",
      accessControl.address
    )
    const parentFGO = await ParentFGO.deploy(
      childFGO.address,
      canvasFulfillment.address,
      accessControl.address
    )
    const canvasFGOEscrow = await CanvasFGOEscrow.deploy(
      parentFGO.address,
      childFGO.address,
      accessControl.address,
      "CVEFGO",
      "CanvasFGOEscrow"
    )
    const canvasOracle = await CanvasOracle.deploy(
      accessControl.address,
      "0x3d2bd0e15829aa5c362a4144fdf4a1112fa29b5c", // BONSAI
      "0x554cd6bdD03214b10AafA3e0D4D42De0C5D2937b", // IDRT
      "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // WMATIC
      "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // DAI
      "CVOR",
      "CanvasOracle"
    )
    const preRollNFT = await PreRollNFT.deploy(
      accessControl.address,
      canvasFulfillment.address
    )
    const preRollCollection = await PreRollCollection.deploy(
      preRollNFT.address,
      accessControl.address,
      canvasPayment.address,
      "PRCOL",
      "PreRollCollection"
    )
    const canvasPKPs = await CanvasPKPs.deploy(
      accessControl.address,
      PKP_FIAT,
      "CanvasPKPs",
      "CVPK"
    )
    const canvasSubscription = await CanvasSubscription.deploy(
      accessControl.address,
      canvasPKPs.address,
      PKP_FIAT,
      "CanvasSubscription",
      "CVSU"
    )
    const canvasPreludePoints = await CanvasPreludePoints.deploy(
      accessControl.address,
      "CanvasPreludePoints",
      "CVPP",
      PKP_FIAT
    )
    const canvasMarket = await CanvasMarket.deploy(
      {
        preRollCollection: preRollCollection.address,
        preRollNFT: preRollNFT.address,
        canvasPKPs: canvasPKPs.address,
        canvasPayment: canvasPayment.address,
        oracle: canvasOracle.address,
        accessControl: accessControl.address,
        canvasFulfillment: canvasFulfillment.address,
        customCompositeNFT: customCompositeNFT.address,
        childFGO: childFGO.address,
        parentFGO: parentFGO.address,
        pkpAddress: PKP_FIAT
      },
      "CVMA",
      "CanvasMarket"
    )

    // Wait Contracts Index
    const WAIT_BLOCK_CONFIRMATIONS = 20
    accessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasPayment.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    customCompositeNFT.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasFulfillment.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    childFGO.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    parentFGO.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasFGOEscrow.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasOracle.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    preRollNFT.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    preRollCollection.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasPKPs.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasSubscription.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasMarket.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    canvasPreludePoints.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)

    // Display Deployed Contracts Address
    console.log(`Canvas Access Control deployed at\n${accessControl.address}`)
    console.log(`Canvas Payment deployed at\n${canvasPayment.address}`)
    console.log(
      `Custom Composite NFT deployed at\n${customCompositeNFT.address}`
    )
    console.log(`Canvas Fulfillment deployed at\n${canvasFulfillment.address}`)
    console.log(`Child FGO deployed at\n${childFGO.address}`)
    console.log(`Parent FGO deployed at\n${parentFGO.address}`)
    console.log(`Canvas Escrow deployed at\n${canvasFGOEscrow.address}`)
    console.log(`Canvas Oracle deployed at\n${canvasOracle.address}`)
    console.log(`Pre Roll Collection deployed at\n${preRollCollection.address}`)
    console.log(`Pre Roll NFT deployed at\n${preRollNFT.address}`)
    console.log(`Canvas PKPs deployed at\n${canvasPKPs.address}`)
    console.log(
      `Canvas Subscription deployed at\n${canvasSubscription.address}`
    )
    console.log(`Canvas Market deployed at\n${canvasMarket.address}`)
    console.log(
      `Canvas Prelude Points deployed at\n${canvasPreludePoints.address}`
    )

    // Save Data to JSON
    const storagePath = path.join(
      __dirname,
      "../../../storage/canvas/contracts.json"
    )

    const dataToSave = [
      {
        accessControl: accessControl.address,
        payment: canvasPayment.address,
        compositeNFT: customCompositeNFT.address,
        fulfillment: canvasFulfillment.address,
        childFGO: childFGO.address,
        parentFGO: parentFGO.address,
        escrow: canvasFGOEscrow.address,
        oracle: canvasOracle.address,
        preRollCollection: preRollCollection.address,
        preRollNFT: preRollNFT.address,
        market: canvasMarket.address,
        canvasPKPs: canvasPKPs.address,
        canvasSubscription: canvasSubscription.address,
        preludePoints: canvasPreludePoints.address
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
