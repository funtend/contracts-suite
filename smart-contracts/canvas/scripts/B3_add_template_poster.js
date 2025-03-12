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
      "ipfs://QmUWqatDBdZMyytjsuEGiQEvT3qQDkUNV5smyPWKVQJzht",
      "poster",
      [
        ["ipfs://QmPJaYE5tHj4e9akbjH253DS7TuE7NdXH6F3WQT9QJJ3CV"],
        ["ipfs://Qmc1hgGG3sCKmx88N3yvFmd1aMf3ph6hTnpLLd7qvMuFZE"],
        [
          "ipfs://QmZgNXzgfGnwdWB7zu3rxDvMZUgq1UhYgHeahVwsCuteWt",
          "ipfs://QmeQPnaB7aqSn9twA949R92mEzQvvwSqna8HcrjiTBSK4Y",
          "ipfs://QmdAHoW7V2bPkBKqVJrDPg63Y52BfRWiKoJd5ivGkaZiTk",
          "ipfs://QmZ7PnvBiuWiuHrCCyRSaYcE5aLhnuXH2juiSeVxjPZZGb"
        ],
        [
          "ipfs://Qmd8Ue8yNGfBpPHitS7L5nbkJrWYrsrToFEydWzscEEmo1",
          "ipfs://QmfK6HGeYeV9a6LaVhcTYCj7oE9RzS5JssMRTFnSrMV9mt",
          "ipfs://QmVE5qGDFjt58xKs9wtvKMJAifEBXZntXv8XwfBkzg8h2y"
        ],
        [
          "ipfs://QmP7HbYtr92ahM9srYgMpexMngge2cdxTV6H2Z8KkBH49k",
          "ipfs://QmVekj1WaqbyTmKNha4ACDFMfmw7LTWqYKEWpX73zbwMHm",
          "ipfs://QmZ3yCFYfGsJnH1B7oMAs4JiALWnfogMrJmt1wFDVbszSe"
        ],
        [
          "ipfs://QmQcm6GyT9inRfBWmY6XvQs8BDxt6m2F3ghL7Xw1xE6ed8",
          "ipfs://QmVX9aitRnTtFn5Boccq2fXiZLmtzuDuq6EJgc8K1UW3xv",
          "ipfs://QmeCqAaryW4Znu3BRpDeZ9rQ23r2fShku1W25TXkCJE3p3",
          "ipfs://QmYYYTkCBHwgoa4VM2RWSKmDLVeRvMntkbe1zYQ2wwTQgB",
          "ipfs://QmYJyssMHJsxEsdXStWNQMdray8HmS7PL5zMg6AYEoSjAD",
          "ipfs://QmU94rbLdbZomteRRAR6Bkde3MhRBoAdgzhYK4SWygWDGd"
        ],
        [
          "ipfs://QmQuh5VZYqwx5bFPmPC8iS42kGGw1zScwGmZ7Tgdt6DnxB",
          "ipfs://QmYERoNF5hesjpPogadK1ecZnJnNNvJWKzLdFALRnLWcVq",
          "ipfs://QmcZAyuXoXVTMP8tjKpXXApoN4HmDQSJu4HHndg4idzB33",
          "ipfs://QmTX2NvqPnif5GpfecNDjJ9E5LARqeKc78J5yNSh81WrgY"
        ],
        [
          "ipfs://QmVCz3uknLG8deY1urjdGSbyj1VGcvXtc5wwkKNhCejBqU",
          "ipfs://QmVcbCFUMKeDebDdptJJedLQ2mBDrkuRSVeZnT8t7uWAJW",
          "ipfs://QmZvh5SdjPwu3SRDr93k3wihssFovM1zcW5NzMX9HxeYRJ",
          "ipfs://QmUXE1S7BM37ZS255Fy9Ww1vP6dTQ927bs59FeX4C1VM9R"
        ]
      ],
      [
        "ipfs://QmWRWpomzGbq85GGtAxN3XXfa8VzB5iNtF6zL7sifqsv8b",
        "ipfs://Qmc5xKzXDKwRRGfEcTmqQZn2R61y5fcVcFhgioNrhKm1NV",
        "ipfs://QmSgm3YYzgwobZrqfkWrPaexNG6R9DymNoTA5y5M9ZBSzL",
        "ipfs://Qmc9q63smCJ385AbNBt9e3cWyErZr6AGbpmyRqckTWh8UC",
        "ipfs://Qma7tctPAz3JsB2337wZPYPSDHCWA6h2UHFzdN8s3oKUSZ",
        "ipfs://QmcwGLQ1KoiHfijHyiyELa9WKY54Bsb9qwWcZtbkMchTUN",
        "ipfs://QmbR827aL7Ve44NneVmUm7MfrdRBoVcZxG9UWDh84chYUf",
        "ipfs://QmZ3ci1Qhsmb6ku1sV2ADrf5rJ8PBirtNWWLxKKemMyy6g"
      ],
      [
        "6000000000000000000",
        "8000000000000000000",
        "10000000000000000000"
      ],
      [
        "6000000000000000000",
        "6000000000000000000",
        "6000000000000000000",
        "8000000000000000000",
        "8000000000000000000",
        "6000000000000000000",
        "7000000000000000000",
        "6000000000000000000"
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
