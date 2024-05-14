// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./SafeMath.sol";

contract RedPacket {
    using SafeMath for uint256;

    struct Packet {
        address tokenAddress;
        address creator;
        uint256 createTime;
        uint256 totalAmount;
        uint256 remainingAmount;
        uint256 totalQuantity;
        uint256 remainingQuantity;
        bool isRandom;
        mapping(address => uint256) claimedAmounts;
    }

    mapping(uint256 => Packet) public packets;

    uint256 public packetId;

    event PacketCreated(
        uint256 indexed id,
        address indexed tokenAddress,
        address creator,
        uint256 totalAmount,
        uint256 totalQuantity,
        bool isRandom
    );
    event PacketClaimed(
        uint256 indexed id,
        address indexed claimer,
        uint256 amount
    );

    event PacketRefunded(uint256 indexed id, address indexed creator);

    function createPacket(
        address payable tokenAddress,
        uint256 totalAmount,
        uint256 totalQuantity,
        bool isRandom
    ) external payable {
        require(totalAmount > 0, "Invalid total amount");
        require(totalQuantity > 0, "Invalid total quantity");

        uint256 id = ++packetId;
        packets[id].tokenAddress = tokenAddress;
        packets[id].totalAmount = totalAmount;
        packets[id].remainingAmount = totalAmount;
        packets[id].totalQuantity = totalQuantity;
        packets[id].remainingQuantity = totalQuantity;
        packets[id].creator = msg.sender;
        packets[id].isRandom = isRandom;
        packets[id].createTime = block.timestamp;

        if (tokenAddress == address(0)) {
            require(msg.value >= totalAmount, "Insufficient Ether payment");
        } else {
            IERC20 token = IERC20(tokenAddress);
            require(
                token.balanceOf(msg.sender) >= totalAmount,
                "Insufficient token balance"
            );
            require(
                token.transferFrom(msg.sender, address(this), totalAmount),
                "Token transfer failed"
            );
        }

        emit PacketCreated(
            id,
            tokenAddress,
            msg.sender,
            totalAmount,
            totalQuantity,
            false
        );
    }

    function claimPacket(uint256 id) external payable {
        require(packets[id].remainingAmount > 0, "Packet not found");
        require(packets[id].remainingQuantity > 0, "Packet fully claimed");
        require(
            packets[id].claimedAmounts[msg.sender] <= 0,
            "you have claimed this pocket"
        );
        Packet storage packet = packets[id];
        uint256 amount;

        if (packet.isRandom) {
            amount = getRandomAmount(id);
        } else {
            amount = packet.remainingAmount.div(packet.remainingQuantity);
        }

        require(amount > 0, "Insufficient packet amount");

        packet.remainingAmount = packet.remainingAmount.sub(amount);
        packet.remainingQuantity = packet.remainingQuantity.sub(1);
        packet.claimedAmounts[msg.sender] = packet
            .claimedAmounts[msg.sender]
            .add(amount);

        if (packet.tokenAddress == address(0)) {
            payable(msg.sender).transfer(amount);
        } else {
            // If tokenAddress is not the zero address, it means it's an ERC20 token packet
            IERC20 token = IERC20(packet.tokenAddress);
            require(token.transfer(msg.sender, amount), "Transfer failed");
        }

        emit PacketClaimed(id, msg.sender, amount);
    }

    function refundPacket(uint256 id) external {
        require(packets[id].remainingAmount > 0, "Packet not found");
        require(
            packets[id].creator == msg.sender,
            "Only the creator can refund the packet"
        );
        uint256 createTime = packets[id].createTime;
        require(
            block.timestamp >= (createTime + 24 * 60 * 60),
            "Refund period has not ended"
        );

        Packet storage packet = packets[id];
        uint256 remainingAmount = packet.remainingAmount;

        if (packet.tokenAddress == address(0)) {
            // Refund remaining Ether to the creator
            payable(msg.sender).transfer(remainingAmount);
        } else {
            // Refund remaining tokens to the creator
            IERC20 token = IERC20(packet.tokenAddress);
            require(
                token.transfer(msg.sender, remainingAmount),
                "Token transfer failed"
            );
        }

        packet.remainingAmount = 0;
        packet.remainingQuantity = 0;

        emit PacketRefunded(id, msg.sender);
    }

    function getRandomAmount(uint256 id) internal view returns (uint256) {
        Packet storage packet = packets[id];
        uint256 remainingAmount = packet.remainingAmount;
        uint256 remainingQuantity = packet.remainingQuantity;
        uint256 maxAmount = remainingAmount.div(remainingQuantity).mul(2);

        // Generate a random number using some external source of randomness
        uint256 randomValue = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.difficulty, id))
        ) % maxAmount;

        return randomValue > remainingAmount ? remainingAmount : randomValue;
    }
}
