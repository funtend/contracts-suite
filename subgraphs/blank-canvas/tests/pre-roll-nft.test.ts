import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AccessControlUpdated } from "../generated/schema"
import { AccessControlUpdated as AccessControlUpdatedEvent } from "../generated/PreRollNFT/PreRollNFT"
import { handleAccessControlUpdated } from "../src/pre-roll-nft"
import { createAccessControlUpdatedEvent } from "./pre-roll-nft-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let oldAccessControl = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAccessControl = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let updater = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAccessControlUpdatedEvent = createAccessControlUpdatedEvent(
      oldAccessControl,
      newAccessControl,
      updater
    )
    handleAccessControlUpdated(newAccessControlUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AccessControlUpdated created and stored", () => {
    assert.entityCount("AccessControlUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AccessControlUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "oldAccessControl",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AccessControlUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newAccessControl",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AccessControlUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "updater",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
