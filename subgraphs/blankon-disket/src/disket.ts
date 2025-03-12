import {
  AccessControlUpdated as AccessControlUpdatedEvent,
  DailyMappingsAdded as DailyMappingsAddedEvent
} from "../generated/Disket/Disket"
import { AccessControlUpdated, DailyMappingsAdded } from "../generated/schema"

export function handleAccessControlUpdated(
  event: AccessControlUpdatedEvent
): void {
  let entity = new AccessControlUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._oldAccessControl = event.params._oldAccessControl
  entity._newAccessControl = event.params._newAccessControl
  entity.admin = event.params.admin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDailyMappingsAdded(event: DailyMappingsAddedEvent): void {
  let entity = new DailyMappingsAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._topMirrorers = event.params._topMirrorers
  entity._topCollectors = event.params._topCollectors
  entity._topPosters = event.params._topPosters
  entity._unique = event.params._unique
  entity._highestSpend = event.params._highestSpend
  entity._amountToCollect = event.params._amountToCollect
  entity._amountToCollect72 = event.params._amountToCollect72
  entity._topFollowed = event.params._topFollowed
  entity._revenueChange = event.params._revenueChange
  entity._graph = event.params._graph
  entity._count = event.params._count
  entity.admin = event.params.admin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
