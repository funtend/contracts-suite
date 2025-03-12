import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccessControlUpdated,
  OracleUpdated
} from "../generated/CanvasOracle/CanvasOracle"

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

export function createOracleUpdatedEvent(
  bonsaiPrice: BigInt,
  rupiahPrice: BigInt,
  maticPrice: BigInt,
  daiPrice: BigInt
): OracleUpdated {
  let oracleUpdatedEvent = changetype<OracleUpdated>(newMockEvent())

  oracleUpdatedEvent.parameters = new Array()

  oracleUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "bonsaiPrice",
      ethereum.Value.fromUnsignedBigInt(bonsaiPrice)
    )
  )
  oracleUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "rupiahPrice",
      ethereum.Value.fromUnsignedBigInt(rupiahPrice)
    )
  )
  oracleUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "maticPrice",
      ethereum.Value.fromUnsignedBigInt(maticPrice)
    )
  )
  oracleUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "daiPrice",
      ethereum.Value.fromUnsignedBigInt(daiPrice)
    )
  )

  return oracleUpdatedEvent
}
