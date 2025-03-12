import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccessControlUpdated,
  Approval,
  ApprovalForAll,
  BatchTokenMinted,
  FulfillmentUpdated,
  PreRollCollectionUpdated,
  TokenBurned,
  TokenFulfillerIdUpdated,
  Transfer
} from "../generated/PreRollNFT/PreRollNFT"

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

export function createFulfillmentUpdatedEvent(
  oldFulfillment: Address,
  newFulfillment: Address,
  updater: Address
): FulfillmentUpdated {
  let fulfillmentUpdatedEvent = changetype<FulfillmentUpdated>(newMockEvent())

  fulfillmentUpdatedEvent.parameters = new Array()

  fulfillmentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldFulfillment",
      ethereum.Value.fromAddress(oldFulfillment)
    )
  )
  fulfillmentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFulfillment",
      ethereum.Value.fromAddress(newFulfillment)
    )
  )
  fulfillmentUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return fulfillmentUpdatedEvent
}

export function createPreRollCollectionUpdatedEvent(
  oldPreRollCollection: Address,
  newPreRollCollection: Address,
  updater: Address
): PreRollCollectionUpdated {
  let preRollCollectionUpdatedEvent = changetype<PreRollCollectionUpdated>(
    newMockEvent()
  )

  preRollCollectionUpdatedEvent.parameters = new Array()

  preRollCollectionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPreRollCollection",
      ethereum.Value.fromAddress(oldPreRollCollection)
    )
  )
  preRollCollectionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPreRollCollection",
      ethereum.Value.fromAddress(newPreRollCollection)
    )
  )
  preRollCollectionUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return preRollCollectionUpdatedEvent
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

export function createTokenFulfillerIdUpdatedEvent(
  tokenId: BigInt,
  oldFulfillerId: BigInt,
  newFulfillerId: BigInt,
  updater: Address
): TokenFulfillerIdUpdated {
  let tokenFulfillerIdUpdatedEvent = changetype<TokenFulfillerIdUpdated>(
    newMockEvent()
  )

  tokenFulfillerIdUpdatedEvent.parameters = new Array()

  tokenFulfillerIdUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenFulfillerIdUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldFulfillerId",
      ethereum.Value.fromUnsignedBigInt(oldFulfillerId)
    )
  )
  tokenFulfillerIdUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFulfillerId",
      ethereum.Value.fromUnsignedBigInt(newFulfillerId)
    )
  )
  tokenFulfillerIdUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return tokenFulfillerIdUpdatedEvent
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
