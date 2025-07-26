// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CookieVote {
    address public CookieNFT; // our original contract

    constructor(address _cookieNFT) {
        CookieNFT = _cookieNFT;
    }

    //How many votes does this NFT have
    //tokenId => voteCount
    mapping(uint256 => uint256) public voteCount;

    //has this address voted on an NFT
    //voter => tokenId => hasVoted
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    event Voted(address indexed voter, uint256 indexed tokenId);

    function vote(uint256 tokenId) external {
        require(!hasVoted[msg.sender][tokenId], "Already voted on this token");

        voteCount[tokenId]++;
        hasVoted[msg.sender][tokenId] = true;

        emit Voted(msg.sender, tokenId);
    }

    function getVotes(uint256 tokenId) public view returns(uint256) {
        return voteCount[tokenId];
    }
}

//For a leaderboard: the frontend can sort NFTs by voteCount[tokenId]