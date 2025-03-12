import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccessControlUpdated,
  Approval,
  ApprovalForAll,
  BatchTokenMinted,
  MarketUpdated,
  TokenBurned,
  Transfer
} from "../generated/CanvasComposite/CanvasComposite"

export function createAccessControlUpdatedEvent(
  oldAccessControl: Address,
  newAccessControl: Address,
  updater: Address
): AccessControlUpdated {
  let accessControlUpdatedEvent = changetype<AccessControlUpdated>(
    newMockEvent()
  )

  accessControlUpdatedEvent.parameters = new Array()

  accessControlUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldAccessControl",
      ethereum.Value.fromAddress(oldAccessControl)
    )
  )
  accessControlUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newAccessControl",
      ethereum.Value.fromAddress(newAccessControl)
    )
  )
  accessControlUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return accessControlUpdatedEvent
}

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBatchTokenMintedEvent(
  to: Address,
  tokenIds: Array<BigInt>,
  uri: string
): BatchTokenMinted {
  let batchTokenMintedEvent = changetype<BatchTokenMinted>(newMockEvent())

  batchTokenMintedEvent.parameters = new Array()

  batchTokenMintedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  batchTokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenIds",
      ethereum.Value.fromUnsignedBigIntArray(tokenIds)
    )
  )
  batchTokenMintedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )

  return batchTokenMintedEvent
}

export function createMarketUpdatedEvent(
  oldMarket: Address,
  newMarket: Address,
  updater: Address
): MarketUpdated {
  let marketUpdatedEvent = changetype<MarketUpdated>(newMockEvent())

  marketUpdatedEvent.parameters = new Array()

  marketUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldMarket", ethereum.Value.fromAddress(oldMarket))
  )
  marketUpdatedEvent.parameters.push(
    new ethereum.EventParam("newMarket", ethereum.Value.fromAddress(newMarket))
  )
  marketUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return marketUpdatedEvent
}

export function createTokenBurnedEvent(tokenId: BigInt): TokenBurned {
  let tokenBurnedEvent = changetype<TokenBurned>(newMockEvent())

  tokenBurnedEvent.parameters = new Array()

  tokenBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenBurnedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
