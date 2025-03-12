import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovalForAll,
  ChildBurned,
  ChildTemplateCreated,
  ChildTemplateUpdated,
  ParentIdAdded,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/CanvasChildFGO/CanvasChildFGO"

export function createApprovalForAllEvent(
  account: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createChildBurnedEvent(childTokenId: BigInt): ChildBurned {
  let childBurnedEvent = changetype<ChildBurned>(newMockEvent())

  childBurnedEvent.parameters = new Array()

  childBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "childTokenId",
      ethereum.Value.fromUnsignedBigInt(childTokenId)
    )
  )

  return childBurnedEvent
}

export function createChildTemplateCreatedEvent(
  tokenId: BigInt,
  tokenURI: Array<string>,
  posterURI: string
): ChildTemplateCreated {
  let childTemplateCreatedEvent = changetype<ChildTemplateCreated>(
    newMockEvent()
  )

  childTemplateCreatedEvent.parameters = new Array()

  childTemplateCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  childTemplateCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenURI",
      ethereum.Value.fromStringArray(tokenURI)
    )
  )
  childTemplateCreatedEvent.parameters.push(
    new ethereum.EventParam("posterURI", ethereum.Value.fromString(posterURI))
  )

  return childTemplateCreatedEvent
}

export function createChildTemplateUpdatedEvent(
  tokenId: BigInt,
  newTokenURI: Array<string>,
  newPosterURI: string
): ChildTemplateUpdated {
  let childTemplateUpdatedEvent = changetype<ChildTemplateUpdated>(
    newMockEvent()
  )

  childTemplateUpdatedEvent.parameters = new Array()

  childTemplateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  childTemplateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newTokenURI",
      ethereum.Value.fromStringArray(newTokenURI)
    )
  )
  childTemplateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPosterURI",
      ethereum.Value.fromString(newPosterURI)
    )
  )

  return childTemplateUpdatedEvent
}

export function createParentIdAddedEvent(
  tokenId: BigInt,
  parentId: BigInt
): ParentIdAdded {
  let parentIdAddedEvent = changetype<ParentIdAdded>(newMockEvent())

  parentIdAddedEvent.parameters = new Array()

  parentIdAddedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  parentIdAddedEvent.parameters.push(
    new ethereum.EventParam(
      "parentId",
      ethereum.Value.fromUnsignedBigInt(parentId)
    )
  )

  return parentIdAddedEvent
}

export function createTransferBatchEvent(
  operator: Address,
  from: Address,
  to: Address,
  ids: Array<BigInt>,
  values: Array<BigInt>
): TransferBatch {
  let transferBatchEvent = changetype<TransferBatch>(newMockEvent())

  transferBatchEvent.parameters = new Array()

  transferBatchEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )

  return transferBatchEvent
}

export function createTransferSingleEvent(
  operator: Address,
  from: Address,
  to: Address,
  id: BigInt,
  value: BigInt
): TransferSingle {
  let transferSingleEvent = changetype<TransferSingle>(newMockEvent())

  transferSingleEvent.parameters = new Array()

  transferSingleEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferSingleEvent
}

export function createURIEvent(value: string, id: BigInt): URI {
  let uriEvent = changetype<URI>(newMockEvent())

  uriEvent.parameters = new Array()

  uriEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromString(value))
  )
  uriEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return uriEvent
}
