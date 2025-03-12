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
    const txResponse = await contract.mintFGO(
      "ipfs://QmZTXdZRwFRpGFCidySe2FxHdnStYMHh4LvLYQCF6dgcJ7",
      "hoodie",
      [
        [
          "ipfs://QmUdQv1vJXXr31Gi5SfPNs63JSr5uEMwZnsN2cqWiu5peq",
          "ipfs://QmSwDj5PvVR2U5bN272PnBXt26rvsAABo1irK9UJD3Kqqm",
          "ipfs://QmbiDacUjoqJaD8bNvxksjr4NikCpzbsCagHrb4irfjmyi"
        ],
        [
          "ipfs://QmSMMVx6t296pKF9HmT6jsVW1Lh2MBQ7ZrqTHidtdXHCZg",
          "ipfs://QmcV1g4tVDuAyXZAmTZWsCczxzGfjhGU5zTKnGuGSwk1Eb",
          "ipfs://QmXYsyu24u9cZH52TpnACWiWteYt5mCiTdyAana9gTbq6M",
          "ipfs://Qmc7nV8aoQKkyY6iLLHoR6qxvLXwV21VMq9mLuTneJzonD"
        ],
        [
          "ipfs://Qmbpof8xQt4EXLzHjja37mShBtCXdfNydCFi31ESV1sG3R",
          "ipfs://QmeU94S7CgkcrLneUyNjLHUQYzzW44cxFkFTVFuHBK89eu",
          "ipfs://QmUFuFBnJhU5tBzRuTFfEobyArbLB1LQpTPgM5kh1Gx8sb",
          "ipfs://QmbgNV5qfpUqwB7aZantuLJFJFGCVYMhSU7tipXCrZkeqz",
          "ipfs://QmVZD7t3yQKbzJdrmPLCh8WSwREdiLLmvBT1E3v3TV3uw2",
          "ipfs://QmeQKhhVzv24FvnonUkAicvdTAU91C6KKRxCEAPMK1yQVC",
          "ipfs://QmQ17ByQMRA6fk5gbmuPxiephjsCLeWdTUbXHYKbEFyrA7",
          "ipfs://QmfJYTcT7duBBzX7wRxf8pK85bw7NDjCok1a2tuAzhiuTC",
          "ipfs://QmSAsrmHtbLKap6dnxcsahQsKv1XRF8zDRsfLUaKVNXfot",
          "ipfs://QmVNpHsv1T2DUn4FNdiNsmNgFZFNo22tmCAEhZiMKoN15q"
        ],
        ["ipfs://QmdgzuNmEiRSwsmSw4ghohdx31rdDzwYgQBbXfH3DG9eD5"],
        [
          "ipfs://QmaCRvFxetVUGkCZECNN3SRY6ttd6TDg8jYLsbar2u6cp4",
          "ipfs://QmX7PBgd55gLBEBb6BYWAgrx792C9NkQQSb66eVGjp9WgE",
          "ipfs://QmPdyAWLb6d2fV9Vaz6mNHQVyYSErsCM3f8GMAwJiEz2Pm"
        ],
        [
          "ipfs://QmVpWjHXK4v9k7oZF65guC9sFZvPwNXYkd25NADbscMXWw",
          "ipfs://QmSZY9UHMq3LqePuofNLy64VW8gjqz1WwHfwJxQvCvesXm",
          "ipfs://QmfW7cQZKzLSbqbUomRfC3NV7EsNbZpgSpNprqN2URn4iX"
        ],
        [
          "ipfs://QmQfXP7NwttTzMJUrxRT45UhMmKyfLttsk4DeSFzmTjGoH",
          "ipfs://QmbX1XneCd1S5Ed73dwS7kQytKLbGXsANgoznKdhYZrxuj",
          "ipfs://QmTm4Uvmd8iyYCtm5e4ogm3KWuLxx1dsZZ4o7uvQFSa9fE"
        ],
        [
          "ipfs://QmXYSBBihrbL1VFLVDhWcxccALtovKcBwU2D4Dt2LB1bEr",
          "ipfs://QmZ5GsLFv15bHTugWVF6SU8ZGk7R8dVcmVQMmwJBpm9MBP"
        ]
      ],
      [
        "ipfs://QmRvmEq35Ryos4bxAUgdnDQafVU69SGbD1sWQyRsmHrtqB",
        "ipfs://Qmd64aoVNW78h4wdKaUsratpSQmynDjXiUws3ofiUa4VP2",
        "ipfs://QmWPHenVnJH9BEZsuRGfkaL47UJXjiLL7yeyfgSeRDc1pr",
        "ipfs://QmNPo431gSehZdLFM8gTg6poGepfZhc2r5mL5QUZS43NUH",
        "ipfs://QmV4UHEmkkYVN5pKKhaV2qYAvuCQyLNuUQFYHkpmXiZuMN",
        "ipfs://QmduvRzVTCBZ7qnHz8g2zLVY2utWwfStxVSmBKzcXPHx55",
        "ipfs://QmY6XfuJEEBWd3fHxADRKcETeVTVrL1X4zBhvC8pHUDtLL",
        "ipfs://QmYdfj1j4j4yG89FGd9tkoGcYNfR9yE1dQQgdxbkTbaHz8"
      ],
      ["22000000000000000000"],
      [
        "14000000000000000000",
        "15000000000000000000",
        "16000000000000000000",
        "16000000000000000000",
        "13000000000000000000",
        "12000000000000000000",
        "13000000000000000000",
        "12000000000000000000"
      ],
      1
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
