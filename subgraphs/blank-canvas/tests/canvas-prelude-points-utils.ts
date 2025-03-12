import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccessControlUpdated,
  NewMissionSignUp,
  PKPAddressUpdated,
  ParticipantMissionReference,
  PointsPerMissionSet,
  TotalMissionsSet
} from "../generated/CanvasPreludePoints/CanvasPreludePoints"

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

export function createNewMissionSignUpEvent(
  participantId: BigInt,
  participantAddress: Address
): NewMissionSignUp {
  let newMissionSignUpEvent = changetype<NewMissionSignUp>(newMockEvent())

  newMissionSignUpEvent.parameters = new Array()

  newMissionSignUpEvent.parameters.push(
    new ethereum.EventParam(
      "participantId",
      ethereum.Value.fromUnsignedBigInt(participantId)
    )
  )
  newMissionSignUpEvent.parameters.push(
    new ethereum.EventParam(
      "participantAddress",
      ethereum.Value.fromAddress(participantAddress)
    )
  )

  return newMissionSignUpEvent
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

export function createParticipantMissionReferenceEvent(
  participantAddress: Address,
  missionsCompleted: BigInt,
  totalPoints: BigInt
): ParticipantMissionReference {
  let participantMissionReferenceEvent =
    changetype<ParticipantMissionReference>(newMockEvent())

  participantMissionReferenceEvent.parameters = new Array()

  participantMissionReferenceEvent.parameters.push(
    new ethereum.EventParam(
      "participantAddress",
      ethereum.Value.fromAddress(participantAddress)
    )
  )
  participantMissionReferenceEvent.parameters.push(
    new ethereum.EventParam(
      "missionsCompleted",
      ethereum.Value.fromUnsignedBigInt(missionsCompleted)
    )
  )
  participantMissionReferenceEvent.parameters.push(
    new ethereum.EventParam(
      "totalPoints",
      ethereum.Value.fromUnsignedBigInt(totalPoints)
    )
  )

  return participantMissionReferenceEvent
}

export function createPointsPerMissionSetEvent(
  missionNumbers: Array<BigInt>,
  pointScores: Array<BigInt>
): PointsPerMissionSet {
  let pointsPerMissionSetEvent = changetype<PointsPerMissionSet>(newMockEvent())

  pointsPerMissionSetEvent.parameters = new Array()

  pointsPerMissionSetEvent.parameters.push(
    new ethereum.EventParam(
      "missionNumbers",
      ethereum.Value.fromUnsignedBigIntArray(missionNumbers)
    )
  )
  pointsPerMissionSetEvent.parameters.push(
    new ethereum.EventParam(
      "pointScores",
      ethereum.Value.fromUnsignedBigIntArray(pointScores)
    )
  )

  return pointsPerMissionSetEvent
}

export function createTotalMissionsSetEvent(
  missionNumber: BigInt
): TotalMissionsSet {
  let totalMissionsSetEvent = changetype<TotalMissionsSet>(newMockEvent())

  totalMissionsSetEvent.parameters = new Array()

  totalMissionsSetEvent.parameters.push(
    new ethereum.EventParam(
      "missionNumber",
      ethereum.Value.fromUnsignedBigInt(missionNumber)
    )
  )

  return totalMissionsSetEvent
}
