import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  FGOTemplateCreated,
  FGOTemplateUpdated,
  ParentBurned,
  Transfer
} from "../generated/CanvasParentFGO/CanvasParentFGO"

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

export function createFGOTemplateCreatedEvent(
  parentTokenId: BigInt,
  parentURI: string,
  childTokenIds: Array<BigInt>
): FGOTemplateCreated {
  let fgoTemplateCreatedEvent = changetype<FGOTemplateCreated>(newMockEvent())

  fgoTemplateCreatedEvent.parameters = new Array()

  fgoTemplateCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "parentTokenId",
      ethereum.Value.fromUnsignedBigInt(parentTokenId)
    )
  )
  fgoTemplateCreatedEvent.parameters.push(
    new ethereum.EventParam("parentURI", ethereum.Value.fromString(parentURI))
  )
  fgoTemplateCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "childTokenIds",
      ethereum.Value.fromUnsignedBigIntArray(childTokenIds)
    )
  )

  return fgoTemplateCreatedEvent
}

export function createFGOTemplateUpdatedEvent(
  parentTokenId: BigInt,
  newParentURI: string,
  childTokenIds: Array<BigInt>
): FGOTemplateUpdated {
  let fgoTemplateUpdatedEvent = changetype<FGOTemplateUpdated>(newMockEvent())

  fgoTemplateUpdatedEvent.parameters = new Array()

  fgoTemplateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "parentTokenId",
      ethereum.Value.fromUnsignedBigInt(parentTokenId)
    )
  )
  fgoTemplateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newParentURI",
      ethereum.Value.fromString(newParentURI)
    )
  )
  fgoTemplateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "childTokenIds",
      ethereum.Value.fromUnsignedBigIntArray(childTokenIds)
    )
  )

  return fgoTemplateUpdatedEvent
}

export function createParentBurnedEvent(parentTokenId: BigInt): ParentBurned {
  let parentBurnedEvent = changetype<ParentBurned>(newMockEvent())

  parentBurnedEvent.parameters = new Array()

  parentBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "parentTokenId",
      ethereum.Value.fromUnsignedBigInt(parentTokenId)
    )
  )

  return parentBurnedEvent
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
