// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// V2.5 IMPORTS
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract Lotto is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {

    struct Ticket {
        address player;
        uint8[7] numbers;
    }

    uint256 public constant TICKET_PRICE = 0.01 ether;
    uint256 public lastDrawTimestamp;
    uint256 public interval = 5 minutes;
    uint8[7] public lastWinningNumbers;
    Ticket[] public tickets;

    // We save the owner's address here
    address public s_owner;

    // FIXED: Track rolling prize pool (carries over leftover money)
    uint256 public prizePool;

    // V2.5 Variables
    uint256 s_subscriptionId;
    bytes32 keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 callbackGasLimit = 2500000;
    uint16 requestConfirmations = 3;

    // V2.5 Constructor
    constructor(uint256 subscriptionId, address vrfCoordinator)
        VRFConsumerBaseV2Plus(vrfCoordinator)
    {
        s_subscriptionId = subscriptionId;
        lastDrawTimestamp = block.timestamp;
        s_owner = msg.sender;
    }

    function buyTicket(uint8[7] memory _numbers) external payable {
        require(msg.sender != s_owner, "Owner cannot play");
        require(msg.value == TICKET_PRICE, "Incorrect ETH amount");
        for(uint i=0; i<7; i++) {
            require(_numbers[i] >= 1 && _numbers[i] <= 49, "Numbers must be 1-49");
        }
        tickets.push(Ticket(msg.sender, _numbers));

        // FIXED: Add ticket revenue to prize pool (minus owner fee)
        uint256 ownerFee = TICKET_PRICE * 10 / 100;
        uint256 ticketAmount = TICKET_PRICE - ownerFee;
        prizePool += ticketAmount;

        // Pay owner immediately (10% of ticket price)
        (bool success, ) = payable(s_owner).call{value: ownerFee}("");
        require(success, "Owner fee transfer failed");
    }

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - lastDrawTimestamp) > interval && tickets.length > 0;
        performData = "";
    }

    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp - lastDrawTimestamp) > interval && tickets.length > 0) {
            lastDrawTimestamp = block.timestamp;

            s_vrfCoordinator.requestRandomWords(
                VRFV2PlusClient.RandomWordsRequest({
                    keyHash: keyHash,
                    subId: s_subscriptionId,
                    requestConfirmations: requestConfirmations,
                    callbackGasLimit: callbackGasLimit,
                    numWords: 7,
                    extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
                })
            );
        }
    }

    function fulfillRandomWords(uint256, uint256[] calldata randomWords) internal override {
        for (uint i = 0; i < 7; i++) {
            lastWinningNumbers[i] = uint8((randomWords[i] % 49) + 1);
        }
        distributePrizes();
        delete tickets;
    }

    function distributePrizes() internal {
        if (prizePool == 0) return;

        uint256 distributedAmount = 0;

        for (uint i = 0; i < tickets.length; i++) {
            uint8 matchCount = 0;
            for (uint j = 0; j < 7; j++) {
                if (tickets[i].numbers[j] == lastWinningNumbers[j]) {
                    matchCount++;
                } else {
                    break;
                }
            }

            uint256 payoutPercent = 0;
            if (matchCount == 2) payoutPercent = 5;
            else if (matchCount == 3) payoutPercent = 10;
            else if (matchCount == 4) payoutPercent = 15;
            else if (matchCount == 5 || matchCount == 6) payoutPercent = 20;
            else if (matchCount == 7) payoutPercent = 30;

            if (payoutPercent > 0) {
                uint256 prize = (prizePool * payoutPercent) / 100;
                distributedAmount += prize;
                payable(tickets[i].player).transfer(prize);
            }
        }

        // FIXED: Leftover amount stays in prizePool for next draw
        prizePool -= distributedAmount;
    }

    // Get all unique player addresses in current pool
    function getPlayers() external view returns (address[] memory) {
        address[] memory allPlayers = new address[](tickets.length);
        uint256 uniqueCount = 0;

        for (uint i = 0; i < tickets.length; i++) {
            bool isUnique = true;
            for (uint j = 0; j < uniqueCount; j++) {
                if (allPlayers[j] == tickets[i].player) {
                    isUnique = false;
                    break;
                }
            }
            if (isUnique) {
                allPlayers[uniqueCount] = tickets[i].player;
                uniqueCount++;
            }
        }

        // Resize array to actual unique count
        address[] memory uniquePlayers = new address[](uniqueCount);
        for (uint i = 0; i < uniqueCount; i++) {
            uniquePlayers[i] = allPlayers[i];
        }
        return uniquePlayers;
    }

    // Check if address has already bought a ticket
    function hasPlayerBought(address player) external view returns (bool) {
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].player == player) {
                return true;
            }
        }
        return false;
    }

    receive() external payable {}
}
