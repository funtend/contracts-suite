import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
  TokensMinted
} from "../generated/PreRollCollection/PreRollCollection"

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

export function createCanvasFulfillmentUpdatedEvent(
  oldCanvasFulfillment: Address,
  newCanvasFulfillment: Address,
  updater: Address
): CanvasFulfillmentUpdated {
  let canvasFulfillmentUpdatedEvent = changetype<CanvasFulfillmentUpdated>(
    newMockEvent()
  )

  canvasFulfillmentUpdatedEvent.parameters = new Array()

  canvasFulfillmentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldCanvasFulfillment",
      ethereum.Value.fromAddress(oldCanvasFulfillment)
    )
  )
  canvasFulfillmentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCanvasFulfillment",
      ethereum.Value.fromAddress(newCanvasFulfillment)
    )
  )
  canvasFulfillmentUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return canvasFulfillmentUpdatedEvent
}

export function createCanvasMarketUpdatedEvent(
  oldCanvasMarket: Address,
  newCanvasMarket: Address,
  updater: Address
): CanvasMarketUpdated {
  let canvasMarketUpdatedEvent = changetype<CanvasMarketUpdated>(newMockEvent())

  canvasMarketUpdatedEvent.parameters = new Array()

  canvasMarketUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldCanvasMarket",
      ethereum.Value.fromAddress(oldCanvasMarket)
    )
  )
  canvasMarketUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCanvasMarket",
      ethereum.Value.fromAddress(newCanvasMarket)
    )
  )
  canvasMarketUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return canvasMarketUpdatedEvent
}

export function createCanvasPaymentUpdatedEvent(
  oldCanvasPayment: Address,
  newCanvasPayment: Address,
  updater: Address
): CanvasPaymentUpdated {
  let canvasPaymentUpdatedEvent = changetype<CanvasPaymentUpdated>(
    newMockEvent()
  )

  canvasPaymentUpdatedEvent.parameters = new Array()

  canvasPaymentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldCanvasPayment",
      ethereum.Value.fromAddress(oldCanvasPayment)
    )
  )
  canvasPaymentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCanvasPayment",
      ethereum.Value.fromAddress(newCanvasPayment)
    )
  )
  canvasPaymentUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return canvasPaymentUpdatedEvent
}

export function createCollectionAddedEvent(
  collectionId: BigInt,
  amount: BigInt,
  owner: Address
): CollectionAdded {
  let collectionAddedEvent = changetype<CollectionAdded>(newMockEvent())

  collectionAddedEvent.parameters = new Array()

  collectionAddedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  collectionAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return collectionAddedEvent
}

export function createCollectionCreatedEvent(
  collectionId: BigInt,
  uri: string,
  amount: BigInt,
  owner: Address
): CollectionCreated {
  let collectionCreatedEvent = changetype<CollectionCreated>(newMockEvent())

  collectionCreatedEvent.parameters = new Array()

  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )
  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return collectionCreatedEvent
}

export function createCollectionDeletedEvent(
  sender: Address,
  collectionId: BigInt
): CollectionDeleted {
  let collectionDeletedEvent = changetype<CollectionDeleted>(newMockEvent())

  collectionDeletedEvent.parameters = new Array()

  collectionDeletedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  collectionDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )

  return collectionDeletedEvent
}

export function createCollectionDiscountUpdatedEvent(
  collectionId: BigInt,
  discount: BigInt,
  updater: Address
): CollectionDiscountUpdated {
  let collectionDiscountUpdatedEvent = changetype<CollectionDiscountUpdated>(
    newMockEvent()
  )

  collectionDiscountUpdatedEvent.parameters = new Array()

  collectionDiscountUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionDiscountUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "discount",
      ethereum.Value.fromUnsignedBigInt(discount)
    )
  )
  collectionDiscountUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return collectionDiscountUpdatedEvent
}

export function createCollectionFulfillerIdUpdatedEvent(
  collectionId: BigInt,
  oldFulfillerId: BigInt,
  newFulfillerId: BigInt,
  updater: Address
): CollectionFulfillerIdUpdated {
  let collectionFulfillerIdUpdatedEvent =
    changetype<CollectionFulfillerIdUpdated>(newMockEvent())

  collectionFulfillerIdUpdatedEvent.parameters = new Array()

  collectionFulfillerIdUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionFulfillerIdUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldFulfillerId",
      ethereum.Value.fromUnsignedBigInt(oldFulfillerId)
    )
  )
  collectionFulfillerIdUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFulfillerId",
      ethereum.Value.fromUnsignedBigInt(newFulfillerId)
    )
  )
  collectionFulfillerIdUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return collectionFulfillerIdUpdatedEvent
}

export function createCollectionNameUpdatedEvent(
  collectionId: BigInt,
  oldName: string,
  newName: string,
  updater: Address
): CollectionNameUpdated {
  let collectionNameUpdatedEvent = changetype<CollectionNameUpdated>(
    newMockEvent()
  )

  collectionNameUpdatedEvent.parameters = new Array()

  collectionNameUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldName", ethereum.Value.fromString(oldName))
  )
  collectionNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("newName", ethereum.Value.fromString(newName))
  )
  collectionNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return collectionNameUpdatedEvent
}

export function createCollectionPixelTypeUpdatedEvent(
  collectionId: BigInt,
  oldPixelType: string,
  newPixelType: string,
  updater: Address
): CollectionPixelTypeUpdated {
  let collectionPixelTypeUpdatedEvent = changetype<CollectionPixelTypeUpdated>(
    newMockEvent()
  )

  collectionPixelTypeUpdatedEvent.parameters = new Array()

  collectionPixelTypeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionPixelTypeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPixelType",
      ethereum.Value.fromString(oldPixelType)
    )
  )
  collectionPixelTypeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPixelType",
      ethereum.Value.fromString(newPixelType)
    )
  )
  collectionPixelTypeUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return collectionPixelTypeUpdatedEvent
}

export function createCollectionPriceUpdatedEvent(
  collectionId: BigInt,
  oldPrice: Array<BigInt>,
  newPrice: Array<BigInt>,
  updater: Address
): CollectionPriceUpdated {
  let collectionPriceUpdatedEvent = changetype<CollectionPriceUpdated>(
    newMockEvent()
  )

  collectionPriceUpdatedEvent.parameters = new Array()

  collectionPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPrice",
      ethereum.Value.fromUnsignedBigIntArray(oldPrice)
    )
  )
  collectionPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigIntArray(newPrice)
    )
  )
  collectionPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return collectionPriceUpdatedEvent
}

export function createCollectionURIUpdatedEvent(
  collectionId: BigInt,
  oldURI: string,
  newURI: string,
  updater: Address
): CollectionURIUpdated {
  let collectionUriUpdatedEvent = changetype<CollectionURIUpdated>(
    newMockEvent()
  )

  collectionUriUpdatedEvent.parameters = new Array()

  collectionUriUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionUriUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldURI", ethereum.Value.fromString(oldURI))
  )
  collectionUriUpdatedEvent.parameters.push(
    new ethereum.EventParam("newURI", ethereum.Value.fromString(newURI))
  )
  collectionUriUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return collectionUriUpdatedEvent
}

export function createPreRollNFTUpdatedEvent(
  oldPreRollNFT: Address,
  newPreRollNFT: Address,
  updater: Address
): PreRollNFTUpdated {
  let preRollNftUpdatedEvent = changetype<PreRollNFTUpdated>(newMockEvent())

  preRollNftUpdatedEvent.parameters = new Array()

  preRollNftUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPreRollNFT",
      ethereum.Value.fromAddress(oldPreRollNFT)
    )
  )
  preRollNftUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPreRollNFT",
      ethereum.Value.fromAddress(newPreRollNFT)
    )
  )
  preRollNftUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return preRollNftUpdatedEvent
}

export function createTokensMintedEvent(
  collectionId: BigInt,
  uri: string,
  amountMinted: BigInt,
  tokenIdsMinted: Array<BigInt>,
  owner: Address
): TokensMinted {
  let tokensMintedEvent = changetype<TokensMinted>(newMockEvent())

  tokensMintedEvent.parameters = new Array()

  tokensMintedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  tokensMintedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )
  tokensMintedEvent.parameters.push(
    new ethereum.EventParam(
      "amountMinted",
      ethereum.Value.fromUnsignedBigInt(amountMinted)
    )
  )
  tokensMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenIdsMinted",
      ethereum.Value.fromUnsignedBigIntArray(tokenIdsMinted)
    )
  )
  tokensMintedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return tokensMintedEvent
}
