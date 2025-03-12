import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  FGOTemplateCreated as FGOTemplateCreatedEvent,
  FGOTemplateUpdated as FGOTemplateUpdatedEvent,
  ParentBurned as ParentBurnedEvent,
  Transfer as TransferEvent,
} from "../generated/CanvasParentFGO/CanvasParentFGO"
import {
  Approval,
  ApprovalForAll,
  FGOTemplateCreated,
  FGOTemplateUpdated,
  ParentBurned,
  Transfer,
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFGOTemplateCreated(event: FGOTemplateCreatedEvent): void {
  let entity = new FGOTemplateCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.parentTokenId = event.params.parentTokenId
  entity.parentURI = event.params.parentURI
  entity.childTokenIds = event.params.childTokenIds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFGOTemplateUpdated(event: FGOTemplateUpdatedEvent): void {
  let entity = new FGOTemplateUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.parentTokenId = event.params.parentTokenId
  entity.newParentURI = event.params.newParentURI
  entity.childTokenIds = event.params.childTokenIds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleParentBurned(event: ParentBurnedEvent): void {
  let entity = new ParentBurned(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.parentTokenId = event.params.parentTokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
