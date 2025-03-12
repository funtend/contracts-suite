import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccessControlUpdated,
  CanvasFulfillmentUpdated,
  CanvasPKPsUpdated,
  CanvasPaymentUpdated,
  ChildFGOUpdated,
  CompositeNFTUpdated,
  OracleUpdated,
  OrderCreated,
  PKPAddressUpdated,
  ParentFGOUpdated,
  PreRollCollectionUpdated,
  PreRollNFTUpdated,
  SubOrderIsFulfilled,
  TokensBought,
  UpdateOrderDetails,
  UpdateOrderMessage,
  UpdateSubOrderStatus
} from "../generated/CanvasMarket/CanvasMarket"

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

export function createCanvasPKPsUpdatedEvent(
  oldCanvasPKPs: Address,
  newCanvasPKPs: Address,
  updater: Address
): CanvasPKPsUpdated {
  let canvasPkPsUpdatedEvent = changetype<CanvasPKPsUpdated>(newMockEvent())

  canvasPkPsUpdatedEvent.parameters = new Array()

  canvasPkPsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldCanvasPKPs",
      ethereum.Value.fromAddress(oldCanvasPKPs)
    )
  )
  canvasPkPsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCanvasPKPs",
      ethereum.Value.fromAddress(newCanvasPKPs)
    )
  )
  canvasPkPsUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return canvasPkPsUpdatedEvent
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

export function createChildFGOUpdatedEvent(
  oldChildFGO: Address,
  newChildFGO: Address,
  updater: Address
): ChildFGOUpdated {
  let childFgoUpdatedEvent = changetype<ChildFGOUpdated>(newMockEvent())

  childFgoUpdatedEvent.parameters = new Array()

  childFgoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldChildFGO",
      ethereum.Value.fromAddress(oldChildFGO)
    )
  )
  childFgoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newChildFGO",
      ethereum.Value.fromAddress(newChildFGO)
    )
  )
  childFgoUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return childFgoUpdatedEvent
}

export function createCompositeNFTUpdatedEvent(
  oldCompositeNFT: Address,
  newCompositeNFT: Address,
  updater: Address
): CompositeNFTUpdated {
  let compositeNftUpdatedEvent = changetype<CompositeNFTUpdated>(newMockEvent())

  compositeNftUpdatedEvent.parameters = new Array()

  compositeNftUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldCompositeNFT",
      ethereum.Value.fromAddress(oldCompositeNFT)
    )
  )
  compositeNftUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCompositeNFT",
      ethereum.Value.fromAddress(newCompositeNFT)
    )
  )
  compositeNftUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return compositeNftUpdatedEvent
}

export function createOracleUpdatedEvent(
  oldOracle: Address,
  newOracle: Address,
  updater: Address
): OracleUpdated {
  let oracleUpdatedEvent = changetype<OracleUpdated>(newMockEvent())

  oracleUpdatedEvent.parameters = new Array()

  oracleUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldOracle", ethereum.Value.fromAddress(oldOracle))
  )
  oracleUpdatedEvent.parameters.push(
    new ethereum.EventParam("newOracle", ethereum.Value.fromAddress(newOracle))
  )
  oracleUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return oracleUpdatedEvent
}

export function createOrderCreatedEvent(
  orderId: BigInt,
  prices: Array<BigInt>,
  totalPrice: BigInt,
  buyer: Address,
  fulfillmentInformation: string,
  sinPKP: boolean,
  pkpTokenId: string
): OrderCreated {
  let orderCreatedEvent = changetype<OrderCreated>(newMockEvent())

  orderCreatedEvent.parameters = new Array()

  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "prices",
      ethereum.Value.fromUnsignedBigIntArray(prices)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalPrice",
      ethereum.Value.fromUnsignedBigInt(totalPrice)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillmentInformation",
      ethereum.Value.fromString(fulfillmentInformation)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("sinPKP", ethereum.Value.fromBoolean(sinPKP))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("pkpTokenId", ethereum.Value.fromString(pkpTokenId))
  )

  return orderCreatedEvent
}

export function createPKPAddressUpdatedEvent(
  oldPKPAddress: Address,
  newPKPAddress: Address,
  updater: Address
): PKPAddressUpdated {
  let pkpAddressUpdatedEvent = changetype<PKPAddressUpdated>(newMockEvent())

  pkpAddressUpdatedEvent.parameters = new Array()

  pkpAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPKPAddress",
      ethereum.Value.fromAddress(oldPKPAddress)
    )
  )
  pkpAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPKPAddress",
      ethereum.Value.fromAddress(newPKPAddress)
    )
  )
  pkpAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return pkpAddressUpdatedEvent
}

export function createParentFGOUpdatedEvent(
  oldParentFGO: Address,
  newParentFGO: Address,
  updater: Address
): ParentFGOUpdated {
  let parentFgoUpdatedEvent = changetype<ParentFGOUpdated>(newMockEvent())

  parentFgoUpdatedEvent.parameters = new Array()

  parentFgoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldParentFGO",
      ethereum.Value.fromAddress(oldParentFGO)
    )
  )
  parentFgoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newParentFGO",
      ethereum.Value.fromAddress(newParentFGO)
    )
  )
  parentFgoUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return parentFgoUpdatedEvent
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

export function createSubOrderIsFulfilledEvent(
  subOrderId: BigInt,
  fulfillerAddress: Address
): SubOrderIsFulfilled {
  let subOrderIsFulfilledEvent = changetype<SubOrderIsFulfilled>(newMockEvent())

  subOrderIsFulfilledEvent.parameters = new Array()

  subOrderIsFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "subOrderId",
      ethereum.Value.fromUnsignedBigInt(subOrderId)
    )
  )
  subOrderIsFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillerAddress",
      ethereum.Value.fromAddress(fulfillerAddress)
    )
  )

  return subOrderIsFulfilledEvent
}

export function createTokensBoughtEvent(
  preRollIds: Array<BigInt>,
  customIds: Array<BigInt>,
  preRollAmounts: Array<BigInt>,
  customAmounts: Array<BigInt>,
  chosenTokenAddress: Address,
  prices: Array<BigInt>,
  buyer: Address
): TokensBought {
  let tokensBoughtEvent = changetype<TokensBought>(newMockEvent())

  tokensBoughtEvent.parameters = new Array()

  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "preRollIds",
      ethereum.Value.fromUnsignedBigIntArray(preRollIds)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "customIds",
      ethereum.Value.fromUnsignedBigIntArray(customIds)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "preRollAmounts",
      ethereum.Value.fromUnsignedBigIntArray(preRollAmounts)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "customAmounts",
      ethereum.Value.fromUnsignedBigIntArray(customAmounts)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "chosenTokenAddress",
      ethereum.Value.fromAddress(chosenTokenAddress)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "prices",
      ethereum.Value.fromUnsignedBigIntArray(prices)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return tokensBoughtEvent
}

export function createUpdateOrderDetailsEvent(
  orderId: BigInt,
  newOrderDetails: string,
  buyer: Address
): UpdateOrderDetails {
  let updateOrderDetailsEvent = changetype<UpdateOrderDetails>(newMockEvent())

  updateOrderDetailsEvent.parameters = new Array()

  updateOrderDetailsEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  updateOrderDetailsEvent.parameters.push(
    new ethereum.EventParam(
      "newOrderDetails",
      ethereum.Value.fromString(newOrderDetails)
    )
  )
  updateOrderDetailsEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return updateOrderDetailsEvent
}

export function createUpdateOrderMessageEvent(
  orderId: BigInt,
  newMessageDetails: string,
  buyer: Address
): UpdateOrderMessage {
  let updateOrderMessageEvent = changetype<UpdateOrderMessage>(newMockEvent())

  updateOrderMessageEvent.parameters = new Array()

  updateOrderMessageEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  updateOrderMessageEvent.parameters.push(
    new ethereum.EventParam(
      "newMessageDetails",
      ethereum.Value.fromString(newMessageDetails)
    )
  )
  updateOrderMessageEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return updateOrderMessageEvent
}

export function createUpdateSubOrderStatusEvent(
  subOrderId: BigInt,
  newSubOrderStatus: string,
  buyer: Address
): UpdateSubOrderStatus {
  let updateSubOrderStatusEvent = changetype<UpdateSubOrderStatus>(
    newMockEvent()
  )

  updateSubOrderStatusEvent.parameters = new Array()

  updateSubOrderStatusEvent.parameters.push(
    new ethereum.EventParam(
      "subOrderId",
      ethereum.Value.fromUnsignedBigInt(subOrderId)
    )
  )
  updateSubOrderStatusEvent.parameters.push(
    new ethereum.EventParam(
      "newSubOrderStatus",
      ethereum.Value.fromString(newSubOrderStatus)
    )
  )
  updateSubOrderStatusEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return updateSubOrderStatusEvent
}
