import {
  AccessControlUpdated as AccessControlUpdatedEvent,
  CanvasPKPsUpdated as CanvasPKPsUpdatedEvent,
  PKPAddressUpdated as PKPAddressUpdatedEvent,
  SubscriberAdded as SubscriberAddedEvent,
  SubscriberReactivated as SubscriberReactivatedEvent,
  SubscriberRemoved as SubscriberRemovedEvent,
} from "../generated/CanvasSubscription/CanvasSubscription"
import {
  AccessControlUpdated,
  CanvasPKPsUpdated,
  PKPAddressUpdated,
  SubscriberAdded,
  SubscriberReactivated,
  SubscriberRemoved,
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

export function handleSubscriberAdded(event: SubscriberAddedEvent): void {
  let entity = new SubscriberAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.subscriberId = event.params.subscriberId
  entity.tokenId = event.params.tokenId
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriberReactivated(
  event: SubscriberReactivatedEvent,
): void {
  let entity = new SubscriberReactivated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.subscriberId = event.params.subscriberId
  entity.tokenId = event.params.tokenId
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriberRemoved(event: SubscriberRemovedEvent): void {
  let entity = new SubscriberRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.subscriberId = event.params.subscriberId
  entity.tokenId = event.params.tokenId
  entity.updater = event.params.updater

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
