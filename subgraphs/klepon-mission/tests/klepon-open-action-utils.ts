import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  NewFactoryDeployment,
  PlayerCompletedMilestone,
  PlayerCompletedMission,
  PlayerJoinedMission,
  MissionInitialized
} from "../generated/KleponOpenAction/KleponOpenAction"

export function createNewFactoryDeploymentEvent(
  kac: Address,
  ke: Address,
  kmd: Address,
  km: Address,
  knc: Address
): NewFactoryDeployment {
  let newFactoryDeploymentEvent = changetype<NewFactoryDeployment>(
    newMockEvent()
  )

  newFactoryDeploymentEvent.parameters = new Array()

  newFactoryDeploymentEvent.parameters.push(
    new ethereum.EventParam("kac", ethereum.Value.fromAddress(kac))
  )
  newFactoryDeploymentEvent.parameters.push(
    new ethereum.EventParam("ke", ethereum.Value.fromAddress(ke))
  )
  newFactoryDeploymentEvent.parameters.push(
    new ethereum.EventParam("kmd", ethereum.Value.fromAddress(kmd))
  )
  newFactoryDeploymentEvent.parameters.push(
    new ethereum.EventParam("km", ethereum.Value.fromAddress(km))
  )
  newFactoryDeploymentEvent.parameters.push(
    new ethereum.EventParam("knc", ethereum.Value.fromAddress(knc))
  )

  return newFactoryDeploymentEvent
}

export function createPlayerCompletedMilestoneEvent(
  missionId: BigInt,
  milestoneId: BigInt,
  playerAddress: Address
): PlayerCompletedMilestone {
  let playerCompletedMilestoneEvent = changetype<PlayerCompletedMilestone>(
    newMockEvent()
  )

  playerCompletedMilestoneEvent.parameters = new Array()

  playerCompletedMilestoneEvent.parameters.push(
    new ethereum.EventParam(
      "missionId",
      ethereum.Value.fromUnsignedBigInt(missionId)
    )
  )
  playerCompletedMilestoneEvent.parameters.push(
    new ethereum.EventParam(
      "milestoneId",
      ethereum.Value.fromUnsignedBigInt(milestoneId)
    )
  )
  playerCompletedMilestoneEvent.parameters.push(
    new ethereum.EventParam(
      "playerAddress",
      ethereum.Value.fromAddress(playerAddress)
    )
  )

  return playerCompletedMilestoneEvent
}

export function createPlayerCompletedMissionEvent(
  missionId: BigInt,
  pubId: BigInt,
  profileId: BigInt,
  envokerAddress: Address
): PlayerCompletedMission {
  let playerCompletedMissionEvent = changetype<PlayerCompletedMission>(
    newMockEvent()
  )

  playerCompletedMissionEvent.parameters = new Array()

  playerCompletedMissionEvent.parameters.push(
    new ethereum.EventParam(
      "missionId",
      ethereum.Value.fromUnsignedBigInt(missionId)
    )
  )
  playerCompletedMissionEvent.parameters.push(
    new ethereum.EventParam("pubId", ethereum.Value.fromUnsignedBigInt(pubId))
  )
  playerCompletedMissionEvent.parameters.push(
    new ethereum.EventParam(
      "profileId",
      ethereum.Value.fromUnsignedBigInt(profileId)
    )
  )
  playerCompletedMissionEvent.parameters.push(
    new ethereum.EventParam(
      "envokerAddress",
      ethereum.Value.fromAddress(envokerAddress)
    )
  )

  return playerCompletedMissionEvent
}

export function createPlayerJoinedMissionEvent(
  playerProfileId: BigInt,
  missionId: BigInt
): PlayerJoinedMission {
  let playerJoinedMissionEvent = changetype<PlayerJoinedMission>(newMockEvent())

  playerJoinedMissionEvent.parameters = new Array()

  playerJoinedMissionEvent.parameters.push(
    new ethereum.EventParam(
      "playerProfileId",
      ethereum.Value.fromUnsignedBigInt(playerProfileId)
    )
  )
  playerJoinedMissionEvent.parameters.push(
    new ethereum.EventParam(
      "missionId",
      ethereum.Value.fromUnsignedBigInt(missionId)
    )
  )

  return playerJoinedMissionEvent
}

export function createMissionInitializedEvent(
  missionId: BigInt,
  pubId: BigInt,
  profileId: BigInt,
  envokerAddress: Address
): MissionInitialized {
  let missionInitializedEvent = changetype<MissionInitialized>(newMockEvent())

  missionInitializedEvent.parameters = new Array()

  missionInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "missionId",
      ethereum.Value.fromUnsignedBigInt(missionId)
    )
  )
  missionInitializedEvent.parameters.push(
    new ethereum.EventParam("pubId", ethereum.Value.fromUnsignedBigInt(pubId))
  )
  missionInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "profileId",
      ethereum.Value.fromUnsignedBigInt(profileId)
    )
  )
  missionInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "envokerAddress",
      ethereum.Value.fromAddress(envokerAddress)
    )
  )

  return missionInitializedEvent
}
