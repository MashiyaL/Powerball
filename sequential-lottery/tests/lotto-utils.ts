import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CoordinatorSet,
  DrawComplete,
  DrawInitiated,
  OwnershipTransferRequested,
  OwnershipTransferred,
  PrizePaid,
  TicketPurchased,
  WinningNumbersDrawn
} from "../generated/Lotto/Lotto"

export function createCoordinatorSetEvent(
  vrfCoordinator: Address
): CoordinatorSet {
  let coordinatorSetEvent = changetype<CoordinatorSet>(newMockEvent())

  coordinatorSetEvent.parameters = new Array()

  coordinatorSetEvent.parameters.push(
    new ethereum.EventParam(
      "vrfCoordinator",
      ethereum.Value.fromAddress(vrfCoordinator)
    )
  )

  return coordinatorSetEvent
}

export function createDrawCompleteEvent(
  prizePoolRemaining: BigInt
): DrawComplete {
  let drawCompleteEvent = changetype<DrawComplete>(newMockEvent())

  drawCompleteEvent.parameters = new Array()

  drawCompleteEvent.parameters.push(
    new ethereum.EventParam(
      "prizePoolRemaining",
      ethereum.Value.fromUnsignedBigInt(prizePoolRemaining)
    )
  )

  return drawCompleteEvent
}

export function createDrawInitiatedEvent(timestamp: BigInt): DrawInitiated {
  let drawInitiatedEvent = changetype<DrawInitiated>(newMockEvent())

  drawInitiatedEvent.parameters = new Array()

  drawInitiatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return drawInitiatedEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent =
    changetype<OwnershipTransferRequested>(newMockEvent())

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createPrizePaidEvent(
  player: Address,
  amount: BigInt,
  matchCount: i32
): PrizePaid {
  let prizePaidEvent = changetype<PrizePaid>(newMockEvent())

  prizePaidEvent.parameters = new Array()

  prizePaidEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  prizePaidEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  prizePaidEvent.parameters.push(
    new ethereum.EventParam(
      "matchCount",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(matchCount))
    )
  )

  return prizePaidEvent
}

export function createTicketPurchasedEvent(
  player: Address,
  numbers: Array<i32>
): TicketPurchased {
  let ticketPurchasedEvent = changetype<TicketPurchased>(newMockEvent())

  ticketPurchasedEvent.parameters = new Array()

  ticketPurchasedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  ticketPurchasedEvent.parameters.push(
    new ethereum.EventParam("numbers", ethereum.Value.fromI32Array(numbers))
  )

  return ticketPurchasedEvent
}

export function createWinningNumbersDrawnEvent(
  numbers: Array<i32>
): WinningNumbersDrawn {
  let winningNumbersDrawnEvent = changetype<WinningNumbersDrawn>(newMockEvent())

  winningNumbersDrawnEvent.parameters = new Array()

  winningNumbersDrawnEvent.parameters.push(
    new ethereum.EventParam("numbers", ethereum.Value.fromI32Array(numbers))
  )

  return winningNumbersDrawnEvent
}
