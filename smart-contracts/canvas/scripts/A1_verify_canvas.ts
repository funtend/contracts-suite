import { run } from "hardhat"

// SYSTEM START
const PKP_FIAT = "0x15584102a2b2300aa3acc1d4aa1548cf679453f5" // Funtend Wallet
// SYSTEM END

// CANVAS START
const CANVAS_ACCESS_CONTROL = "0xA547A39DD8A0b974E4f93404276B4B033E9E1803" // CanvasAccessControl
const CANVAS_PAYMENT = "0x635036bFa2DAcA1EE1a539Be6fA5Eb9BE2D35eD3" // CanvasPayment
const CUSTOM_COMPOSITE_NFT = "0x3E8DB8a5e606495e8bCFA1b5cB45769a9c05f9E7" // CustomCompositeNFT
const CANVAS_FULFILLMENT = "0x452fe81bcf83708b99179c381276F72D09306188" // CanvasFulfillment
const CANVAS_CHILD_FGO = "0x6cc8BfE94c056F535dd64d6Eb3faBAAb641816Eb" // CanvasChildFGO
const CANVAS_PARENT_FGO = "0xa2c02358b1B1e8dD7Be19f2159207d2f6EE3ecEc" // CanvasParentFGO
const CANVAS_FGO_ESCROW = "0x8A9c826D90647417E12Fd3a5c13C38af0A917660" // CanvasFGOEscrow
const CANVAS_ORACLE = "0x9cf4BB7054A077DeC29A7d25A55dFb87F6eF1508" // CanvasOracle
const PRE_ROLL_COLLECTION = "0x72592B2A3C7DA7902b9bb076527af9B49a886dB2" // PreRollCollection
const PRE_ROLL_NFT = "0x12443c19c8B9312268C20d76166D56342d8134a8" // PreRollNFT
const CANVAS_MARKET = "0x4c5bC151f02Bc64d1B8A7EA7F30F05a0dAD8e8B9" // CanvasMarket
const CANVAS_PKP = "0x0E683868Ccf390C54fB4b88D954B003daCA9D69D" // CanvasPKPs
const CANVAS_SUBSCRIPTION = "0x67eb9c26041270EB74F34260f48680EB5ff6728F" // CanvasSubscription
const CANVAS_PRELUDE_POINTS = "0x1b34d01E67c1335825cAe4994bfae4C29317C7C1" // CanvasPreludePoints
// CANVAS END

const main = async () => {
  try {
    await run(`verify:verify`, {
      address: CANVAS_ACCESS_CONTROL,
      constructorArguments: ["CanvasAccessControl", "CVAC"]
    })
    await run(`verify:verify`, {
      address: CANVAS_PAYMENT,
      constructorArguments: [CANVAS_ACCESS_CONTROL, "CanvasPayment", "CVPA"]
    })
    await run(`verify:verify`, {
      address: CUSTOM_COMPOSITE_NFT,
      constructorArguments: [CANVAS_ACCESS_CONTROL]
    })
    await run(`verify:verify`, {
      address: CANVAS_FULFILLMENT,
      constructorArguments: [CANVAS_ACCESS_CONTROL, "CanvasFulfillment", "CVFU"]
    })
    await run(`verify:verify`, {
      address: CANVAS_CHILD_FGO,
      constructorArguments: ["CanvasChildFGO", "CVCFGO", CANVAS_ACCESS_CONTROL]
    })
    await run(`verify:verify`, {
      address: CANVAS_PARENT_FGO,
      constructorArguments: [
        CANVAS_CHILD_FGO,
        CANVAS_FULFILLMENT,
        CANVAS_ACCESS_CONTROL
      ]
    })
    await run(`verify:verify`, {
      address: CANVAS_FGO_ESCROW,
      constructorArguments: [
        CANVAS_PARENT_FGO,
        CANVAS_CHILD_FGO,
        CANVAS_ACCESS_CONTROL,
        "CVEFGO",
        "CanvasFGOEscrow"
      ]
    })
    await run(`verify:verify`, {
      address: CANVAS_ORACLE,
      constructorArguments: [
        CANVAS_ACCESS_CONTROL,
        "0x3d2bd0e15829aa5c362a4144fdf4a1112fa29b5c", // BONSAI
        "0x554cd6bdD03214b10AafA3e0D4D42De0C5D2937b", // IDRT
        "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // WMATIC
        "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // DAI
        "CVOR",
        "CanvasOracle"
      ]
    })
    await run(`verify:verify`, {
      address: PRE_ROLL_NFT,
      constructorArguments: [CANVAS_ACCESS_CONTROL, CANVAS_FULFILLMENT]
    })
    await run(`verify:verify`, {
      address: PRE_ROLL_COLLECTION,
      constructorArguments: [
        PRE_ROLL_NFT,
        CANVAS_ACCESS_CONTROL,
        CANVAS_PAYMENT,
        "PRCOL",
        "PreRollCollection"
      ]
    })
    await run(`verify:verify`, {
      address: CANVAS_PKP,
      constructorArguments: [
        CANVAS_ACCESS_CONTROL,
        PKP_FIAT,
        "CanvasPKPs",
        "CVPK"
      ]
    })
    await run(`verify:verify`, {
      address: CANVAS_SUBSCRIPTION,
      constructorArguments: [
        CANVAS_ACCESS_CONTROL,
        CANVAS_PKP,
        PKP_FIAT,
        "CanvasSubscription",
        "CVSU"
      ]
    })
    await run(`verify:verify`, {
      address: CANVAS_PRELUDE_POINTS,
      constructorArguments: [
        CANVAS_ACCESS_CONTROL,
        "CanvasPreludePoints",
        "CVPP",
        PKP_FIAT
      ]
    })
    await run(`verify:verify`, {
      address: CANVAS_MARKET,
      constructorArguments: [
        {
          preRollCollection: PRE_ROLL_COLLECTION,
          preRollNFT: PRE_ROLL_NFT,
          canvasPKPs: CANVAS_PKP,
          canvasPayment: CANVAS_PAYMENT,
          oracle: CANVAS_ORACLE,
          accessControl: CANVAS_ACCESS_CONTROL,
          canvasFulfillment: CANVAS_FULFILLMENT,
          customCompositeNFT: CUSTOM_COMPOSITE_NFT,
          childFGO: CANVAS_CHILD_FGO,
          parentFGO: CANVAS_PARENT_FGO,
          pkpAddress: PKP_FIAT
        },
        "CVMA",
        "CanvasMarket"
      ]
    })
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
