import {
  AccessControlUpdated as AccessControlUpdatedEvent,
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BatchTokenMinted as BatchTokenMintedEvent,
  FulfillmentUpdated as FulfillmentUpdatedEvent,
  PreRollCollectionUpdated as PreRollCollectionUpdatedEvent,
  TokenBurned as TokenBurnedEvent,
  TokenFulfillerIdUpdated as TokenFulfillerIdUpdatedEvent,
  Transfer as TransferEvent,
} from "../generated/PreRollNFT/PreRollNFT"
import {
  AccessControlUpdated,
  Approval,
  ApprovalForAll,
  BatchTokenMinted,
  FulfillmentUpdated,
  PreRollCollectionUpdated,
  TokenBurned,
  TokenFulfillerIdUpdated,
  Transfer,
} from "../generated/schema"

export function handleAccessControlUpdated(
  event: AccessControlUpdatedEvent,
): void {
  let entity = new AccessControlUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldAccessControl = event.params.oldAccessControl
  entity.newAccessControl = event.params.newAccessControl
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

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

export function handleBatchTokenMinted(event: BatchTokenMintedEvent): void {
  let entity = new BatchTokenMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.to = event.params.to
  entity.tokenIds = event.params.tokenIds
  entity.uri = event.params.uri

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFulfillmentUpdated(event: FulfillmentUpdatedEvent): void {
  let entity = new FulfillmentUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldFulfillment = event.params.oldFulfillment
  entity.newFulfillment = event.params.newFulfillment
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePreRollCollectionUpdated(
  event: PreRollCollectionUpdatedEvent,
): void {
  let entity = new PreRollCollectionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldPreRollCollection = event.params.oldPreRollCollection
  entity.newPreRollCollection = event.params.newPreRollCollection
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenBurned(event: TokenBurnedEvent): void {
  let entity = new TokenBurned(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenFulfillerIdUpdated(
  event: TokenFulfillerIdUpdatedEvent,
): void {
  let entity = new TokenFulfillerIdUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.tokenId = event.params.tokenId
  entity.oldFulfillerId = event.params.oldFulfillerId
  entity.newFulfillerId = event.params.newFulfillerId
  entity.updater = event.params.updater

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
