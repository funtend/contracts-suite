import { run } from "hardhat"

// BLANKON START
const BLANKON_ACCESS_CONTROL = "0x27c31B9C11A3E42e95C29861C763A01AC217f435"
const BLANKON_PAYMENT = "0xE5B67e93B2A48738772FBBBE1aE3424F9C540fa2"
const BLANKON_NFT = "0x66A26425222c16F7Df8fcDE624aDd063d3Ba1039"
const BLANKON_COLLECTION = "0x189C774a68Be89fd8e8899aA1C12D401E03B06C7"
const BLANKON_DROP = "0x5D93de003406fF91284b8976aAa4a9ef571a0e57"
const BLANKON_MARKETPLACE = "0x1dE4330274476943fD95918e18703872c040E53c"
const BLANKON_ESCROW = "0xE5D4D91E29B265d3956C15F75C974CC4743e3FA1"
const DISKET = "0x6095a6b95fA69f66841F933EF0a6d7DefA172286"
// BLANKON END

const main = async () => {
  try {
    await run(`verify:verify`, {
      address: BLANKON_ACCESS_CONTROL,
      constructorArguments: ["AccessControl", "BLNKA"]
    })
    await run(`verify:verify`, {
      address: BLANKON_PAYMENT,
      constructorArguments: [BLANKON_ACCESS_CONTROL]
    })
    await run(`verify:verify`, {
      address: BLANKON_NFT,
      constructorArguments: [BLANKON_ACCESS_CONTROL]
    })
    await run(`verify:verify`, {
      address: BLANKON_COLLECTION,
      constructorArguments: [
        BLANKON_NFT,
        BLANKON_ACCESS_CONTROL,
        BLANKON_PAYMENT,
        "BLNKC",
        "BlankonCollection"
      ]
    })
    await run(`verify:verify`, {
      address: BLANKON_DROP,
      constructorArguments: [
        BLANKON_COLLECTION,
        BLANKON_ACCESS_CONTROL,
        "BLNKD",
        "BlankonDrop"
      ]
    })
    await run(`verify:verify`, {
      address: BLANKON_MARKETPLACE,
      constructorArguments: [
        BLANKON_COLLECTION,
        BLANKON_ACCESS_CONTROL,
        BLANKON_NFT,
        "BLNKM",
        "BlankonMarketplace"
      ]
    })
    await run(`verify:verify`, {
      address: BLANKON_ESCROW,
      constructorArguments: [
        BLANKON_COLLECTION,
        BLANKON_MARKETPLACE,
        BLANKON_ACCESS_CONTROL,
        BLANKON_NFT,
        "BLNKE",
        "BlankonEscrow"
      ]
    })
    await run(`verify:verify`, {
      address: DISKET,
      constructorArguments: [BLANKON_ACCESS_CONTROL, "DISK", "DISKET"]
    })
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
