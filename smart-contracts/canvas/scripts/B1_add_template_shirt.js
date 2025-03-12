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
      "ipfs://QmdB9fbAZFxPALgpgsSq4bvYNe6KFHVZg4EaLeqpryKgXK",
      "shirt",
      [
        [
          "ipfs://QmSt3vxGoDHTkq9CsLAHL8bidYB3JyFRtwTFM5FELjVGuc",
          "ipfs://QmckQtYP71pVo4tuZcKb3WpyFZ8JMoTYkhnYoSrXtDcFDY",
          "ipfs://QmaEvrZjmA6odJ757pwpNpSirTtvL3rjH2vcJ9fuHt7Gn4"
        ],
        [
          "ipfs://QmQ6nuB3sCwc5TqYELNrcKGZMorP1H73nL31KajiE1ULvw",
          "ipfs://Qmc8SNihNeUhec4GoAaJ9S6873moXFFuF3edEqj4iEfvJY",
          "ipfs://QmP7LAcB6ng98z9EFu7KyUCV2oaAsNMuiYsz49kSiht8dr"
        ],
        [
          "ipfs://QmbPKqkWLFyammL51RNZ7bymTQnuQJDjoRbqE3CZjdurtc",
          "ipfs://QmQKPxrGXVdmNhawv9L2jx5wTkeJGqDQCKzDRLNCkH5EBA",
          "ipfs://QmP2UVYk5Cf6JT9eJ2kHS7gMb67X7vaYWaqxc8cM7n3dq1"
        ],
        [
          "ipfs://QmYd4KzLcSFc2rbJn5kNV6YvxmN1rbbHJXWwoGhzcdonen",
          "ipfs://QmdbvTmPW68EhnZZTBo4KveACkBetZjpYBj59XMrrzkR2f",
          "ipfs://QmTmF1zYr6NudP9XHLKoPJwmVjHpJrQcVHrvcTXLGj9Vyc",
          "ipfs://QmWP792Lz5Z6LoPibG5QrUjgXR61purNfZPmcrDXYCEtr3",
          "ipfs://QmcZtiuAjEDHPcUFNnc6NS1aDtJdPdsMLuFRrDfEXMYoHi",
          "ipfs://QmYyXAzCoxP6gL9LXjkTKky7xxq4fr4Ra7tCgwLojQov8k",
          "ipfs://QmbD3trhtivANSDEiQ5ewKgeMPiT5jGSL9gvMSs7GA7dFy"
        ],
        [
          "ipfs://QmZGM3d5zZjJi93CM1PnLaa3MCxtwW1Cshc9ZCgc6278my",
          "ipfs://QmU1ZwvTf6MarP3TNKJuu1X1NHgqE2opRWVwSCj8UA25QF"
        ],
        [
          "ipfs://QmPk1y1NWnNAEf2bcvYFihfUznwFj7uDcxiXxNCAGVsRpt",
          "ipfs://QmTNRMSxhto3mdk9vCjPevENfuX6RFzJw5nbWYpHpUjWAi",
          "ipfs://QmTs6qk9ftNy63EksZSNmUZvSSKT11rho27GBT9j9vsxd2"
        ],
        [
          "ipfs://QmaqxpKQPJMqMZrzAF1sUkuRDuy15286hXfkFPCdoHx4iZ",
          "ipfs://QmQd4crHHjQrQJc6LDXctGKecxN7EN27hnR4dBSyWuA7yQ",
          "ipfs://Qmd74k9ByugmbaVjrnYUiG2dJMjwJ3sf2TRs3TrnB4umFY",
          "ipfs://QmQYZPgywFKAh3PoS29jttFF1wNCdoAhqpdZBQPJY7Gfur",
          "ipfs://QmU15srKcDcRH8i3h7EKDoP1sA1yqGzBmz85zMkqXpavk3",
          "ipfs://QmQyCTBCeZqJhvGWS8UduhgtVpAN7jFaVob7ekXd8CvUHc",
          "ipfs://QmQuokRBYQ4irAvhLDQujA18M1AXSqGAAd4T8fUcbLgBZv"
        ],
        [
          "ipfs://QmfCfoVh4pjSTinuG3bLJQq4w7wsdEg2Khs8d4J4CT5CcE",
          "ipfs://QmRV8k8wxkzYPcmtW9EZh9DD6N3zS48RsAzsTxXKcLKqP3"
        ]
      ],
      [
        "ipfs://Qmc1KPhfkS5Pz8anY1s1JwhfsPRasQAApNgqhxdmvVrXBf",
        "ipfs://QmUH7py6UUJKKjRW9fFUKAEsQYrWrgAJBMRFVhdykRVqxE",
        "ipfs://QmV2BBibAmU838ZMqCx4b8UExmyubu3rxXEGn97N5mqzyX",
        "ipfs://QmZBwazgj6Pe4LjL8WESEVDpUQcUWvkFKoiB9C26Q9211N",
        "ipfs://Qmag1tj3opcSNSmuBJcH77KmkstuK8UeViapW6V7oafJt6",
        "ipfs://QmVjGBoNnXJW27LvXCkrjpMgbHXTnZhUhDVRzjj6jdufe5",
        "ipfs://QmbXird3u3NobppBCVrfYY3NQRdesNU7YgtgtnmK9iHm5H",
        "ipfs://QmdDtA2uSGejNdTZ9aDEdDrwsUUTLmJqM1Af2atChceuaY"
      ],
      ["20000000000000000000"],
      [
        "15000000000000000000",
        "15000000000000000000",
        "17000000000000000000",
        "17000000000000000000",
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
