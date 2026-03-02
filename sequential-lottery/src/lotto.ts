import {
  CoordinatorSet as CoordinatorSetEvent,
  DrawComplete as DrawCompleteEvent,
  DrawInitiated as DrawInitiatedEvent,
  OwnershipTransferRequested as OwnershipTransferRequestedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PrizePaid as PrizePaidEvent,
  TicketPurchased as TicketPurchasedEvent,
  WinningNumbersDrawn as WinningNumbersDrawnEvent
} from "../generated/Lotto/Lotto"
import {
  CoordinatorSet,
  DrawComplete,
  DrawInitiated,
  OwnershipTransferRequested,
  OwnershipTransferred,
  PrizePaid,
  TicketPurchased,
  WinningNumbersDrawn
} from "../generated/schema"

export function handleCoordinatorSet(event: CoordinatorSetEvent): void {
  let entity = new CoordinatorSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.vrfCoordinator = event.params.vrfCoordinator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDrawComplete(event: DrawCompleteEvent): void {
  let entity = new DrawComplete(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prizePoolRemaining = event.params.prizePoolRemaining

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDrawInitiated(event: DrawInitiatedEvent): void {
  let entity = new DrawInitiated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferRequested(
  event: OwnershipTransferRequestedEvent
): void {
  let entity = new OwnershipTransferRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePrizePaid(event: PrizePaidEvent): void {
  let entity = new PrizePaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player
  entity.amount = event.params.amount
  entity.matchCount = event.params.matchCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTicketPurchased(event: TicketPurchasedEvent): void {
  let entity = new TicketPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player
  entity.numbers = event.params.numbers

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWinningNumbersDrawn(
  event: WinningNumbersDrawnEvent
): void {
  let entity = new WinningNumbersDrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.numbers = event.params.numbers

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
