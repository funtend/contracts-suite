import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccessControlUpdated,
  CanvasPKPsUpdated,
  PKPAddressUpdated,
  SubscriberAdded,
  SubscriberReactivated,
  SubscriberRemoved
} from "../generated/CanvasSubscription/CanvasSubscription"

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

export function createSubscriberAddedEvent(
  subscriberId: BigInt,
  tokenId: string,
  updater: Address
): SubscriberAdded {
  let subscriberAddedEvent = changetype<SubscriberAdded>(newMockEvent())

  subscriberAddedEvent.parameters = new Array()

  subscriberAddedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriberId",
      ethereum.Value.fromUnsignedBigInt(subscriberId)
    )
  )
  subscriberAddedEvent.parameters.push(
    new ethereum.EventParam("tokenId", ethereum.Value.fromString(tokenId))
  )
  subscriberAddedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return subscriberAddedEvent
}

export function createSubscriberReactivatedEvent(
  subscriberId: BigInt,
  tokenId: string,
  updater: Address
): SubscriberReactivated {
  let subscriberReactivatedEvent = changetype<SubscriberReactivated>(
    newMockEvent()
  )

  subscriberReactivatedEvent.parameters = new Array()

  subscriberReactivatedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriberId",
      ethereum.Value.fromUnsignedBigInt(subscriberId)
    )
  )
  subscriberReactivatedEvent.parameters.push(
    new ethereum.EventParam("tokenId", ethereum.Value.fromString(tokenId))
  )
  subscriberReactivatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return subscriberReactivatedEvent
}

export function createSubscriberRemovedEvent(
  subscriberId: BigInt,
  tokenId: string,
  updater: Address
): SubscriberRemoved {
  let subscriberRemovedEvent = changetype<SubscriberRemoved>(newMockEvent())

  subscriberRemovedEvent.parameters = new Array()

  subscriberRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriberId",
      ethereum.Value.fromUnsignedBigInt(subscriberId)
    )
  )
  subscriberRemovedEvent.parameters.push(
    new ethereum.EventParam("tokenId", ethereum.Value.fromString(tokenId))
  )
  subscriberRemovedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )

  return subscriberRemovedEvent
}
