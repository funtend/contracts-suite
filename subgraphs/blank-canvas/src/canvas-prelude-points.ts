import {
  AccessControlUpdated as AccessControlUpdatedEvent,
  NewMissionSignUp as NewMissionSignUpEvent,
  PKPAddressUpdated as PKPAddressUpdatedEvent,
  ParticipantMissionReference as ParticipantMissionReferenceEvent,
  PointsPerMissionSet as PointsPerMissionSetEvent,
  TotalMissionsSet as TotalMissionsSetEvent,
} from "../generated/CanvasPreludePoints/CanvasPreludePoints"
import {
  AccessControlUpdated,
  NewMissionSignUp,
  PKPAddressUpdated,
  ParticipantMissionReference,
  PointsPerMissionSet,
  TotalMissionsSet,
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

export function handleNewMissionSignUp(event: NewMissionSignUpEvent): void {
  let entity = new NewMissionSignUp(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.participantId = event.params.participantId
  entity.participantAddress = event.params.participantAddress

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

export function handleParticipantMissionReference(
  event: ParticipantMissionReferenceEvent,
): void {
  let entity = new ParticipantMissionReference(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.participantAddress = event.params.participantAddress
  entity.missionsCompleted = event.params.missionsCompleted
  entity.totalPoints = event.params.totalPoints

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePointsPerMissionSet(
  event: PointsPerMissionSetEvent,
): void {
  let entity = new PointsPerMissionSet(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.missionNumbers = event.params.missionNumbers
  entity.pointScores = event.params.pointScores

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTotalMissionsSet(event: TotalMissionsSetEvent): void {
  let entity = new TotalMissionsSet(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.missionNumber = event.params.missionNumber

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
