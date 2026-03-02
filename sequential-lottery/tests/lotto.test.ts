import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CoordinatorSet } from "../generated/schema"
import { CoordinatorSet as CoordinatorSetEvent } from "../generated/Lotto/Lotto"
import { handleCoordinatorSet } from "../src/lotto"
import { createCoordinatorSetEvent } from "./lotto-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let vrfCoordinator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newCoordinatorSetEvent = createCoordinatorSetEvent(vrfCoordinator)
    handleCoordinatorSet(newCoordinatorSetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("CoordinatorSet created and stored", () => {
    assert.entityCount("CoordinatorSet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CoordinatorSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "vrfCoordinator",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
