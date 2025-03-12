import {
  AccessControlUpdated as AccessControlUpdatedEvent,
  OracleUpdated as OracleUpdatedEvent,
} from "../generated/CanvasOracle/CanvasOracle"
import { AccessControlUpdated, OracleUpdated } from "../generated/schema"

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

export function handleOracleUpdated(event: OracleUpdatedEvent): void {
  let entity = new OracleUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.bonsaiPrice = event.params.bonsaiPrice
  entity.rupiahPrice = event.params.rupiahPrice
  entity.maticPrice = event.params.maticPrice
  entity.daiPrice = event.params.daiPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
