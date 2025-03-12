import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccessControlUpdated,
  DailyMappingsAdded
} from "../generated/Disket/Disket"

export function createAccessControlUpdatedEvent(
  _oldAccessControl: Address,
  _newAccessControl: Address,
  admin: Address
): AccessControlUpdated {
  let accessControlUpdatedEvent = changetype<AccessControlUpdated>(
    newMockEvent()
  )

  accessControlUpdatedEvent.parameters = new Array()

  accessControlUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "_oldAccessControl",
      ethereum.Value.fromAddress(_oldAccessControl)
    )
  )
  accessControlUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "_newAccessControl",
      ethereum.Value.fromAddress(_newAccessControl)
    )
  )
  accessControlUpdatedEvent.parameters.push(
    new ethereum.EventParam("admin", ethereum.Value.fromAddress(admin))
  )

  return accessControlUpdatedEvent
}

export function createDailyMappingsAddedEvent(
  _topMirrorers: string,
  _topCollectors: string,
  _topPosters: string,
  _unique: string,
  _highestSpend: string,
  _amountToCollect: string,
  _amountToCollect72: string,
  _topFollowed: string,
  _revenueChange: string,
  _graph: string,
  _count: BigInt,
  admin: Address
): DailyMappingsAdded {
  let dailyMappingsAddedEvent = changetype<DailyMappingsAdded>(newMockEvent())

  dailyMappingsAddedEvent.parameters = new Array()

  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_topMirrorers",
      ethereum.Value.fromString(_topMirrorers)
    )
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_topCollectors",
      ethereum.Value.fromString(_topCollectors)
    )
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_topPosters",
      ethereum.Value.fromString(_topPosters)
    )
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam("_unique", ethereum.Value.fromString(_unique))
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_highestSpend",
      ethereum.Value.fromString(_highestSpend)
    )
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_amountToCollect",
      ethereum.Value.fromString(_amountToCollect)
    )
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_amountToCollect72",
      ethereum.Value.fromString(_amountToCollect72)
    )
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_topFollowed",
      ethereum.Value.fromString(_topFollowed)
    )
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_revenueChange",
      ethereum.Value.fromString(_revenueChange)
    )
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam("_graph", ethereum.Value.fromString(_graph))
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam("_count", ethereum.Value.fromUnsignedBigInt(_count))
  )
  dailyMappingsAddedEvent.parameters.push(
    new ethereum.EventParam("admin", ethereum.Value.fromAddress(admin))
  )

  return dailyMappingsAddedEvent
}
