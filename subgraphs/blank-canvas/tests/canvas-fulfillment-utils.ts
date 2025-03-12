import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccessControlUpdated,
  FulfillerAddressUpdated,
  FulfillerCreated,
  FulfillerPercentUpdated
} from "../generated/CanvasFulfillment/CanvasFulfillment"

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

export function createFulfillerAddressUpdatedEvent(
  fulfillerId: BigInt,
  newFulfillerAddress: Address
): FulfillerAddressUpdated {
  let fulfillerAddressUpdatedEvent = changetype<FulfillerAddressUpdated>(
    newMockEvent()
  )

  fulfillerAddressUpdatedEvent.parameters = new Array()

  fulfillerAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillerId",
      ethereum.Value.fromUnsignedBigInt(fulfillerId)
    )
  )
  fulfillerAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFulfillerAddress",
      ethereum.Value.fromAddress(newFulfillerAddress)
    )
  )

  return fulfillerAddressUpdatedEvent
}

export function createFulfillerCreatedEvent(
  fulfillerId: BigInt,
  fulfillerPercent: BigInt,
  fulfillerAddress: Address
): FulfillerCreated {
  let fulfillerCreatedEvent = changetype<FulfillerCreated>(newMockEvent())

  fulfillerCreatedEvent.parameters = new Array()

  fulfillerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillerId",
      ethereum.Value.fromUnsignedBigInt(fulfillerId)
    )
  )
  fulfillerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillerPercent",
      ethereum.Value.fromUnsignedBigInt(fulfillerPercent)
    )
  )
  fulfillerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillerAddress",
      ethereum.Value.fromAddress(fulfillerAddress)
    )
  )

  return fulfillerCreatedEvent
}

export function createFulfillerPercentUpdatedEvent(
  fulfillerId: BigInt,
  newFulfillerPercent: BigInt
): FulfillerPercentUpdated {
  let fulfillerPercentUpdatedEvent = changetype<FulfillerPercentUpdated>(
    newMockEvent()
  )

  fulfillerPercentUpdatedEvent.parameters = new Array()

  fulfillerPercentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "fulfillerId",
      ethereum.Value.fromUnsignedBigInt(fulfillerId)
    )
  )
  fulfillerPercentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFulfillerPercent",
      ethereum.Value.fromUnsignedBigInt(newFulfillerPercent)
    )
  )

  return fulfillerPercentUpdatedEvent
}
