import {
  AccessControlUpdated as AccessControlUpdatedEvent,
  FulfillerAddressUpdated as FulfillerAddressUpdatedEvent,
  FulfillerCreated as FulfillerCreatedEvent,
  FulfillerPercentUpdated as FulfillerPercentUpdatedEvent,
} from "../generated/CanvasFulfillment/CanvasFulfillment"
import {
  AccessControlUpdated,
  FulfillerAddressUpdated,
  FulfillerCreated,
  FulfillerPercentUpdated,
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

export function handleFulfillerAddressUpdated(
  event: FulfillerAddressUpdatedEvent,
): void {
  let entity = new FulfillerAddressUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.fulfillerId = event.params.fulfillerId
  entity.newFulfillerAddress = event.params.newFulfillerAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFulfillerCreated(event: FulfillerCreatedEvent): void {
  let entity = new FulfillerCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.fulfillerId = event.params.fulfillerId
  entity.fulfillerPercent = event.params.fulfillerPercent
  entity.fulfillerAddress = event.params.fulfillerAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFulfillerPercentUpdated(
  event: FulfillerPercentUpdatedEvent,
): void {
  let entity = new FulfillerPercentUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.fulfillerId = event.params.fulfillerId
  entity.newFulfillerPercent = event.params.newFulfillerPercent

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
