const { ethers } = require("hardhat")

async function main() {
  const address = "0xa2c02358b1B1e8dD7Be19f2159207d2f6EE3ecEc"

  const [deployer] = await ethers.getSigners()
  console.log("Using account:", deployer.address)

  const ABI = [
    {
      inputs: [
        { internalType: "address", name: "_childContract", type: "address" },
        {
          internalType: "address",
          name: "_fulfillmentContract",
          type: "address"
        },
        {
          internalType: "address",
          name: "_accessControlContract",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "Approval",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address"
        },
        { indexed: false, internalType: "bool", name: "approved", type: "bool" }
      ],
      name: "ApprovalForAll",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "parentTokenId",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "string",
          name: "parentURI",
          type: "string"
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "childTokenIds",
          type: "uint256[]"
        }
      ],
      name: "FGOTemplateCreated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "parentTokenId",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "string",
          name: "newParentURI",
          type: "string"
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "childTokenIds",
          type: "uint256[]"
        }
      ],
      name: "FGOTemplateUpdated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "parentTokenId",
          type: "uint256"
        }
      ],
      name: "ParentBurned",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address"
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" }
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "getAccessControl",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getApproved",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getFGOChild",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getFGOEscrow",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getFulfiller",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "getParentChildTokens",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "getParentCreator",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "getParentFulfillerId",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "getParentPixelType",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "getParentPrice",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getTotalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "operator", type: "address" }
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        { internalType: "string", name: "_parentURI", type: "string" },
        { internalType: "string", name: "_pixelType", type: "string" },
        { internalType: "string[][]", name: "_childURIs", type: "string[][]" },
        { internalType: "string[]", name: "_childPosterURI", type: "string[]" },
        { internalType: "uint256[]", name: "_prices", type: "uint256[]" },
        { internalType: "uint256[]", name: "_childPrices", type: "uint256[]" },
        { internalType: "uint256", name: "_fulfillerId", type: "uint256" }
      ],
      name: "mintFGO",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" }
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "data", type: "bytes" }
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" }
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "uint256", name: "_parentTokenId", type: "uint256" },
        { internalType: "uint256[]", name: "_childTokenIds", type: "uint256[]" }
      ],
      name: "setChildTokenIds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "_newEscrowAddress", type: "address" }
      ],
      name: "setFGOEscrow",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "tokenURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" }
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "_newAccessControl", type: "address" }
      ],
      name: "updateAccessControl",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "_newChildAddress", type: "address" }
      ],
      name: "updateChildFGO",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "uint256", name: "_parentId", type: "uint256" },
        { internalType: "uint256[]", name: "_newPrices", type: "uint256[]" },
        {
          internalType: "uint256[]",
          name: "_newChildPrices",
          type: "uint256[]"
        },
        { internalType: "uint256", name: "_newFulfillerId", type: "uint256" },
        { internalType: "string", name: "_newParentURI", type: "string" },
        { internalType: "string", name: "_newPixelType", type: "string" },
        {
          internalType: "string[][]",
          name: "_newChildURIs",
          type: "string[][]"
        },
        {
          internalType: "string[]",
          name: "_newChildPosterURI",
          type: "string[]"
        },
        { internalType: "address", name: "_newCreator", type: "address" }
      ],
      name: "updateFGO",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "address", name: "_newFulfillment", type: "address" }
      ],
      name: "updateFulfillment",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ]

  const contract = new ethers.Contract(address, ABI, deployer)

  try {
    const txResponse = await contract.updateFGO(
      4,
      [
        "5000000000000000000",
        "6000000000000000000",
        "8000000000000000000"
      ],
      [
        "5000000000000000000",
        "6000000000000000000",
        "5000000000000000000",
        "6000000000000000000",
        "8000000000000000000",
        "6000000000000000000",
        "5000000000000000000",
        "5000000000000000000"
      ],
      1,
      "ipfs://QmV2hhmEWestBsWh8HvRHey5gHAKQY762h69x6Vc18PDeJ",
      "sticker",
      [
        ["ipfs://QmcavvxPriZhtKw4qmausXuQS4HgvQCBLSfWutSMLruqnC"],
        ["ipfs://QmPqoXFhuuiDGN3sqrKAJMuzrxi84pGFPP1rnpDoSnXxUs"],
        [
          "ipfs://Qmbg24vFMdSwj6wf5m88gE47cdpE21V7yGkpFdFcAVB3xW",
          "ipfs://QmXDa1AUsARccDoo5tpHY44JNzeWG8frcqDttQkjT3F3MK"
        ],
        [
          "ipfs://QmYGwtza1538nWhKqD6WMG71ttXmjaA1N4diNyutcHXhBP",
          "ipfs://QmRt7uM2VdfeZ2bEyJhQj3KZwTMB86oSKJnqaWBGhj1TsX"
        ],
        [
          "ipfs://QmRrfZruRYQWo8Q94JRtK5kykUY48HArRwcnGHhJ1G1xCm",
          "ipfs://QmVWnGNwA3FtY63BsyoNPUQ7nZKh1YaQ8T9iqKjXABkTsu",
          "ipfs://QmP6zcR5hwSuWE7kRpnB5cxj1BdmNAp4b2csWnKxKwFDVg",
          "ipfs://QmQyB8ewYviNHAfkaX3hzp7uJEPK8CkJMBVE9XeRFiP4Km",
          "ipfs://QmaCFRSrUj736KxnERtZtddQK6BB96gvNjC9EaSvcdUS4w"
        ],
        [
          "ipfs://QmXAGcTDTUH1v1bpMPPMDodKx2Swx6H9YHptkuyzCg1v8c",
          "ipfs://QmchUrJhNgi1k3VseL1JD4qQEEAHnURUxtJ59HUCkC8wgS",
          "ipfs://QmV3P3x1qCHtkVpuubn8ThJuYrK6s8NmEfQjUT3VvD6eSF"
        ],
        ["ipfs://QmPczMUKsHci67ptdTw47UK4KAnDno8Kg2TjTA3gBnNTDn"],
        ["ipfs://QmQBZ7PQ27CjX5YDddHC2q9JXmdVUBuL8ubJ4M9vovBuYd"]
      ],
      [
        "ipfs://QmdGtHQSviUdqDFuGdTmC28gL3GiqBmUxF2WnSLjPirtnh",
        "ipfs://QmPh2gEhoktGrKExrhhPUfznbrfvWg3ABcqJFeaakaZ5df",
        "ipfs://QmRihwA2AE98QWrmS5eF31MbGdzKZkDBQHFuCEBkfjVhRT",
        "ipfs://QmQVBYA3ZM8HjqmoVsaJy5ufh7K4hz24evfs86KsjmGy1G",
        "ipfs://QmQiALFwHBi82mGjRvJ4HjGujNTkSeocAf4NDCosmjfeYc",
        "ipfs://QmNegNrCjhXc2g8LD3WcjN6pFoWWkZ98REBcF6K5WAmuZ4",
        "ipfs://QmZkqTWSE6NGUina3cEAvd56yVSPb5UNsdjjhZhGJxfTrQ",
        "ipfs://QmeP3nrQunM5Q2snZuuyy4ZYyDvjFJTvQHS5o57Eft8ihP"
      ],
      "0x15584102a2b2300aa3acc1d4aa1548cf679453f5"
    )
    console.log("Transaction hash:", txResponse.hash)
    const receipt = await txResponse.wait()
    console.log("Transaction was mined in block", receipt.blockNumber)
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
