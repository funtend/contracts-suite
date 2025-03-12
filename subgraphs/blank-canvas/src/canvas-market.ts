import {
  AccessControlUpdated as AccessControlUpdatedEvent,
  CanvasFulfillmentUpdated as CanvasFulfillmentUpdatedEvent,
  CanvasPKPsUpdated as CanvasPKPsUpdatedEvent,
  CanvasPaymentUpdated as CanvasPaymentUpdatedEvent,
  ChildFGOUpdated as ChildFGOUpdatedEvent,
  CompositeNFTUpdated as CompositeNFTUpdatedEvent,
  OracleUpdated as OracleUpdatedEvent,
  OrderCreated as OrderCreatedEvent,
  PKPAddressUpdated as PKPAddressUpdatedEvent,
  ParentFGOUpdated as ParentFGOUpdatedEvent,
  PreRollCollectionUpdated as PreRollCollectionUpdatedEvent,
  PreRollNFTUpdated as PreRollNFTUpdatedEvent,
  SubOrderIsFulfilled as SubOrderIsFulfilledEvent,
  TokensBought as TokensBoughtEvent,
  UpdateOrderDetails as UpdateOrderDetailsEvent,
  UpdateOrderMessage as UpdateOrderMessageEvent,
  UpdateSubOrderStatus as UpdateSubOrderStatusEvent,
} from "../generated/CanvasMarket/CanvasMarket"
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
  UpdateSubOrderStatus,
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

export function handleCanvasPKPsUpdated(event: CanvasPKPsUpdatedEvent): void {
  let entity = new CanvasPKPsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldCanvasPKPs = event.params.oldCanvasPKPs
  entity.newCanvasPKPs = event.params.newCanvasPKPs
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

export function handleChildFGOUpdated(event: ChildFGOUpdatedEvent): void {
  let entity = new ChildFGOUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldChildFGO = event.params.oldChildFGO
  entity.newChildFGO = event.params.newChildFGO
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCompositeNFTUpdated(
  event: CompositeNFTUpdatedEvent,
): void {
  let entity = new CompositeNFTUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldCompositeNFT = event.params.oldCompositeNFT
  entity.newCompositeNFT = event.params.newCompositeNFT
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOracleUpdated(event: OracleUpdatedEvent): void {
  let entity = new OracleUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldOracle = event.params.oldOracle
  entity.newOracle = event.params.newOracle
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = new OrderCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.orderId = event.params.orderId
  entity.prices = event.params.prices
  entity.totalPrice = event.params.totalPrice
  entity.buyer = event.params.buyer
  entity.fulfillmentInformation = event.params.fulfillmentInformation
  entity.sinPKP = event.params.sinPKP
  entity.pkpTokenId = event.params.pkpTokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePKPAddressUpdated(event: PKPAddressUpdatedEvent): void {
  let entity = new PKPAddressUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldPKPAddress = event.params.oldPKPAddress
  entity.newPKPAddress = event.params.newPKPAddress
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleParentFGOUpdated(event: ParentFGOUpdatedEvent): void {
  let entity = new ParentFGOUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldParentFGO = event.params.oldParentFGO
  entity.newParentFGO = event.params.newParentFGO
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

export function handleSubOrderIsFulfilled(
  event: SubOrderIsFulfilledEvent,
): void {
  let entity = new SubOrderIsFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.subOrderId = event.params.subOrderId
  entity.fulfillerAddress = event.params.fulfillerAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensBought(event: TokensBoughtEvent): void {
  let entity = new TokensBought(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.preRollIds = event.params.preRollIds
  entity.customIds = event.params.customIds
  entity.preRollAmounts = event.params.preRollAmounts
  entity.customAmounts = event.params.customAmounts
  entity.chosenTokenAddress = event.params.chosenTokenAddress
  entity.prices = event.params.prices
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateOrderDetails(event: UpdateOrderDetailsEvent): void {
  let entity = new UpdateOrderDetails(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.orderId = event.params.orderId
  entity.newOrderDetails = event.params.newOrderDetails
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateOrderMessage(event: UpdateOrderMessageEvent): void {
  let entity = new UpdateOrderMessage(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.orderId = event.params.orderId
  entity.newMessageDetails = event.params.newMessageDetails
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateSubOrderStatus(
  event: UpdateSubOrderStatusEvent,
): void {
  let entity = new UpdateSubOrderStatus(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.subOrderId = event.params.subOrderId
  entity.newSubOrderStatus = event.params.newSubOrderStatus
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
