// SPDX-License-Identifier: GNU GPLv3

pragma solidity <0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintSingle is ERC721, Ownable {
	uint public mintPrice = 0.005
}