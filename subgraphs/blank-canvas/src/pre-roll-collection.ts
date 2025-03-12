import {
  AccessControlUpdated as AccessControlUpdatedEvent,
  CanvasFulfillmentUpdated as CanvasFulfillmentUpdatedEvent,
  CanvasMarketUpdated as CanvasMarketUpdatedEvent,
  CanvasPaymentUpdated as CanvasPaymentUpdatedEvent,
  CollectionAdded as CollectionAddedEvent,
  CollectionCreated as CollectionCreatedEvent,
  CollectionDeleted as CollectionDeletedEvent,
  CollectionDiscountUpdated as CollectionDiscountUpdatedEvent,
  CollectionFulfillerIdUpdated as CollectionFulfillerIdUpdatedEvent,
  CollectionNameUpdated as CollectionNameUpdatedEvent,
  CollectionPixelTypeUpdated as CollectionPixelTypeUpdatedEvent,
  CollectionPriceUpdated as CollectionPriceUpdatedEvent,
  CollectionURIUpdated as CollectionURIUpdatedEvent,
  PreRollNFTUpdated as PreRollNFTUpdatedEvent,
  TokensMinted as TokensMintedEvent,
} from "../generated/PreRollCollection/PreRollCollection"
import {
  AccessControlUpdated,
  CanvasFulfillmentUpdated,
  CanvasMarketUpdated,
  CanvasPaymentUpdated,
  CollectionAdded,
  CollectionCreated,
  CollectionDeleted,
  CollectionDiscountUpdated,
  CollectionFulfillerIdUpdated,
  CollectionNameUpdated,
  CollectionPixelTypeUpdated,
  CollectionPriceUpdated,
  CollectionURIUpdated,
  PreRollNFTUpdated,
  TokensMinted,
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

export function handleCanvasFulfillmentUpdated(
  event: CanvasFulfillmentUpdatedEvent,
): void {
  let entity = new CanvasFulfillmentUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldCanvasFulfillment = event.params.oldCanvasFulfillment
  entity.newCanvasFulfillment = event.params.newCanvasFulfillment
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCanvasMarketUpdated(
  event: CanvasMarketUpdatedEvent,
): void {
  let entity = new CanvasMarketUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldCanvasMarket = event.params.oldCanvasMarket
  entity.newCanvasMarket = event.params.newCanvasMarket
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCanvasPaymentUpdated(
  event: CanvasPaymentUpdatedEvent,
): void {
  let entity = new CanvasPaymentUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldCanvasPayment = event.params.oldCanvasPayment
  entity.newCanvasPayment = event.params.newCanvasPayment
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionAdded(event: CollectionAddedEvent): void {
  let entity = new CollectionAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.amount = event.params.amount
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionCreated(event: CollectionCreatedEvent): void {
  let entity = new CollectionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.uri = event.params.uri
  entity.amount = event.params.amount
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionDeleted(event: CollectionDeletedEvent): void {
  let entity = new CollectionDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sender = event.params.sender
  entity.collectionId = event.params.collectionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionDiscountUpdated(
  event: CollectionDiscountUpdatedEvent,
): void {
  let entity = new CollectionDiscountUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.discount = event.params.discount
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionFulfillerIdUpdated(
  event: CollectionFulfillerIdUpdatedEvent,
): void {
  let entity = new CollectionFulfillerIdUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.oldFulfillerId = event.params.oldFulfillerId
  entity.newFulfillerId = event.params.newFulfillerId
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionNameUpdated(
  event: CollectionNameUpdatedEvent,
): void {
  let entity = new CollectionNameUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.oldName = event.params.oldName
  entity.newName = event.params.newName
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionPixelTypeUpdated(
  event: CollectionPixelTypeUpdatedEvent,
): void {
  let entity = new CollectionPixelTypeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.oldPixelType = event.params.oldPixelType
  entity.newPixelType = event.params.newPixelType
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionPriceUpdated(
  event: CollectionPriceUpdatedEvent,
): void {
  let entity = new CollectionPriceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.oldPrice = event.params.oldPrice
  entity.newPrice = event.params.newPrice
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionURIUpdated(
  event: CollectionURIUpdatedEvent,
): void {
  let entity = new CollectionURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.oldURI = event.params.oldURI
  entity.newURI = event.params.newURI
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePreRollNFTUpdated(event: PreRollNFTUpdatedEvent): void {
  let entity = new PreRollNFTUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldPreRollNFT = event.params.oldPreRollNFT
  entity.newPreRollNFT = event.params.newPreRollNFT
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensMinted(event: TokensMintedEvent): void {
  let entity = new TokensMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.collectionId = event.params.collectionId
  entity.uri = event.params.uri
  entity.amountMinted = event.params.amountMinted
  entity.tokenIdsMinted = event.params.tokenIdsMinted
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
