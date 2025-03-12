import * as fs from "fs"
import { ethers } from "hardhat"
import * as path from "path"

const main = async () => {
  try {
    // Read Contracts
    const BlankonAccessControl =
      await ethers.getContractFactory("AccessControl")
    const BlankonPayment = await ethers.getContractFactory("BlankonPayment")
    const BlankonNFT = await ethers.getContractFactory("BlankonNFT")
    const BlankonCollection =
      await ethers.getContractFactory("BlankonCollection")
    const BlankonDrop = await ethers.getContractFactory("BlankonDrop")
    const BlankonMarketplace =
      await ethers.getContractFactory("BlankonMarketplace")
    const BlankonEscrow = await ethers.getContractFactory("BlankonEscrow")
    const Disket = await ethers.getContractFactory("Disket")

    // Deploy Contracts
    const accessControl = await BlankonAccessControl.deploy(
      "AccessControl",
      "BLNKA"
    )
    const blankonPayment = await BlankonPayment.deploy(accessControl.address)
    const blankonNFT = await BlankonNFT.deploy(accessControl.address)
    const blankonCollection = await BlankonCollection.deploy(
      blankonNFT.address,
      accessControl.address,
      blankonPayment.address,
      "BLNKC",
      "BlankonCollection"
    )
    const blankonDrop = await BlankonDrop.deploy(
      blankonCollection.address,
      accessControl.address,
      "BLNKD",
      "BlankonDrop"
    )
    const blankonMarketplace = await BlankonMarketplace.deploy(
      blankonCollection.address,
      accessControl.address,
      blankonNFT.address,
      "BLNKM",
      "BlankonMarketplace"
    )
    const blankonEscrow = await BlankonEscrow.deploy(
      blankonCollection.address,
      blankonMarketplace.address,
      accessControl.address,
      blankonNFT.address,
      "BLNKE",
      "BlankonEscrow"
    )
    const disket = await Disket.deploy(accessControl.address, "DISK", "DISKET")

    // Wait Contracts Index
    const WAIT_BLOCK_CONFIRMATIONS = 20
    accessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    blankonPayment.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    blankonNFT.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    blankonCollection.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    blankonDrop.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    blankonMarketplace.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    blankonEscrow.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)
    disket.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS)

    // Display Deployed Contracts Address
    console.log(`Blankon Access Control deployed at\n${accessControl.address}`)
    console.log(`Blankon Payment deployed at\n${blankonPayment.address}`)
    console.log(`Blankon NFT deployed at\n${blankonNFT.address}`)
    console.log(`Blankon Collection deployed at\n${blankonCollection.address}`)
    console.log(`Blankon Drop deployed at\n${blankonDrop.address}`)
    console.log(
      `Blankon Marketplace deployed at\n${blankonMarketplace.address}`
    )
    console.log(`Blankon Escrow deployed at\n${blankonEscrow.address}`)
    console.log(`Disket deployed at\n${disket.address}`)

    // Save Data to JSON
    const storagePath = path.join(
      __dirname,
      "../../../storage/blankon/contracts.json"
    )

    const dataToSave = [
      {
        accessControl: accessControl.address,
        blankonPayment: blankonPayment.address,
        blankonNFT: blankonNFT.address,
        blankonCollection: blankonCollection.address,
        blankonDrop: blankonDrop.address,
        blankonMarketplace: blankonMarketplace.address,
        blankonEscrow: blankonEscrow.address
      },
      { disket: disket.address }
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
