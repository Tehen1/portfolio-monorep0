// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import "../contracts/ProofOfRun.sol";

contract ProofOfRunTest is Test {
    ProofOfRun private proofOfRun;
    address private admin = address(1);
    address private minter = address(2);
    address private user1 = address(3);
    address private user2 = address(4);
    address private oracle = address(5);

    uint256 private constant COOLDOWN_PERIOD = 3600;
    uint256 private constant MIN_DISTANCE = 500;

    function setUp() public {
        // Deploy ProofOfRun contract
        proofOfRun = new ProofOfRun();
        proofOfRun.initialize(admin, minter);
    }

    // Test initialization
    function test_initialize() public view {
        assertEq(proofOfRun.owner(), admin);
        assertTrue(proofOfRun.hasRole(proofOfRun.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(proofOfRun.hasRole(proofOfRun.MINTER_ROLE(), minter));
    }

    // Test mint function
    function test_mint() public {
        vm.prank(minter);
        uint256 tokenId = proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        assertEq(tokenId, 0);
        assertEq(proofOfRun.ownerOf(tokenId), user1);
        assertEq(proofOfRun.totalSupply(), 1);
    }

    // Test mint with insufficient distance
    function test_mint_insufficient_distance() public {
        vm.prank(minter);
        vm.expectRevert(abi.encodeWithSelector(ProofOfRun.DistanceTooShort.selector, 400, MIN_DISTANCE));
        proofOfRun.mint(user1, 400, 3600, 500, keccak256("gps_hash_1"));
    }

    // Test cooldown period
    function test_mint_cooldown() public {
        vm.prank(minter);
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        vm.prank(minter);
        vm.expectRevert(abi.encodeWithSelector(ProofOfRun.CooldownNotExpired.selector, COOLDOWN_PERIOD));
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_2"));
    }

    // Test batch mint
    function test_batch_mint() public {
        address[] memory recipients = new address[](2);
        recipients[0] = user1;
        recipients[1] = user2;

        uint256[] memory distances = new uint256[](2);
        distances[0] = 1000;
        distances[1] = 2000;

        uint256[] memory durations = new uint256[](2);
        durations[0] = 3600;
        durations[1] = 7200;

        uint256[] memory calories = new uint256[](2);
        calories[0] = 500;
        calories[1] = 1000;

        bytes32[] memory gpsHashes = new bytes32[](2);
        gpsHashes[0] = keccak256("gps_hash_1");
        gpsHashes[1] = keccak256("gps_hash_2");

        vm.prank(minter);
        uint256[] memory tokenIds = proofOfRun.batchMint(recipients, distances, durations, calories, gpsHashes);

        assertEq(tokenIds.length, 2);
        assertEq(proofOfRun.ownerOf(tokenIds[0]), user1);
        assertEq(proofOfRun.ownerOf(tokenIds[1]), user2);
        assertEq(proofOfRun.totalSupply(), 2);
    }

    // Test validate activity
    function test_validate_activity() public {
        vm.prank(minter);
        uint256 tokenId = proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        vm.prank(minter); // minter is also oracle initially
        proofOfRun.validateActivity(tokenId, true);

        ProofOfRun.Activity memory activity = proofOfRun.getActivity(tokenId);
        assertTrue(activity.validated);
    }

    // Test burn function
    function test_burn() public {
        vm.prank(minter);
        uint256 tokenId = proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        vm.prank(user1);
        proofOfRun.burn(tokenId);

        vm.expectRevert("ERC721: invalid token ID");
        proofOfRun.ownerOf(tokenId);
    }

    // Test batch burn
    function test_batch_burn() public {
        vm.prank(minter);
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));
        vm.prank(minter);
        proofOfRun.mint(user1, 2000, 7200, 1000, keccak256("gps_hash_2"));

        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 0;
        tokenIds[1] = 1;

        vm.prank(user1);
        proofOfRun.batchBurn(tokenIds);

        vm.expectRevert("ERC721: invalid token ID");
        proofOfRun.ownerOf(0);
        vm.expectRevert("ERC721: invalid token ID");
        proofOfRun.ownerOf(1);
    }

    // Test pause/unpause
    function test_pause_unpause() public {
        vm.prank(admin);
        proofOfRun.pause();

        vm.prank(minter);
        vm.expectRevert("Pausable: paused");
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        vm.prank(admin);
        proofOfRun.unpause();

        vm.prank(minter);
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));
    }

    // Test soulbound transfer restriction
    function test_soulbound_transfer() public {
        vm.prank(minter);
        uint256 tokenId = proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(ProofOfRun.SoulboundTransferNotAllowed.selector));
        proofOfRun.transferFrom(user1, user2, tokenId);
    }

    // Test access control
    function test_access_control() public {
        vm.prank(user1);
        vm.expectRevert("AccessControl: account 0x0000000000000000000000000000000000000003 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b");
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));
    }

    // Test getActivity function
    function test_get_activity() public {
        vm.prank(minter);
        uint256 tokenId = proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        ProofOfRun.Activity memory activity = proofOfRun.getActivity(tokenId);

        assertEq(activity.distance, 1000);
        assertEq(activity.duration, 3600);
        assertEq(activity.calories, 500);
        assertEq(activity.gpsProofHash, keccak256("gps_hash_1"));
        assertFalse(activity.validated);
    }

    // Test constants
    function test_constants() public view {
        assertEq(proofOfRun.COOLDOWN_PERIOD(), COOLDOWN_PERIOD);
        assertEq(proofOfRun.MIN_DISTANCE(), MIN_DISTANCE);
    }

    // Test totalSupply
    function test_total_supply() public {
        assertEq(proofOfRun.totalSupply(), 0);

        vm.prank(minter);
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));
        assertEq(proofOfRun.totalSupply(), 1);

        vm.prank(minter);
        proofOfRun.mint(user2, 2000, 7200, 1000, keccak256("gps_hash_2"));
        assertEq(proofOfRun.totalSupply(), 2);
    }

    // Test lastMintTimestamp
    function test_last_mint_timestamp() public {
        vm.prank(minter);
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        uint256 lastMintTime = proofOfRun.lastMintTimestamp(user1);
        assertEq(lastMintTime, block.timestamp);
    }

    // Test batch mint limits
    function test_batch_mint_limits() public {
        address[] memory recipients = new address[](11);
        uint256[] memory distances = new uint256[](11);
        uint256[] memory durations = new uint256[](11);
        uint256[] memory calories = new uint256[](11);
        bytes32[] memory gpsHashes = new bytes32[](11);

        for (uint256 i = 0; i < 11; i++) {
            recipients[i] = user1;
            distances[i] = 1000;
            durations[i] = 3600;
            calories[i] = 500;
            gpsHashes[i] = keccak256(abi.encodePacked("gps_hash_", i));
        }

        vm.prank(minter);
        vm.expectRevert("Batch size exceeds limit");
        proofOfRun.batchMint(recipients, distances, durations, calories, gpsHashes);
    }

    // Test batch burn limits
    function test_batch_burn_limits() public {
        uint256[] memory tokenIds = new uint256[](11);

        vm.prank(user1);
        vm.expectRevert("Batch size exceeds limit");
        proofOfRun.batchBurn(tokenIds);
    }

    // Test burn by non-owner
    function test_burn_non_owner() public {
        vm.prank(minter);
        uint256 tokenId = proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        vm.prank(user2);
        vm.expectRevert("Not token owner");
        proofOfRun.burn(tokenId);
    }

    // Test batch burn by non-owner
    function test_batch_burn_non_owner() public {
        vm.prank(minter);
        proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));
        vm.prank(minter);
        proofOfRun.mint(user1, 2000, 7200, 1000, keccak256("gps_hash_2"));

        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 0;
        tokenIds[1] = 1;

        vm.prank(user2);
        vm.expectRevert("Not token owner");
        proofOfRun.batchBurn(tokenIds);
    }

    // Test validate activity by non-oracle
    function test_validate_non_oracle() public {
        vm.prank(minter);
        uint256 tokenId = proofOfRun.mint(user1, 1000, 3600, 500, keccak256("gps_hash_1"));

        vm.prank(user1);
        vm.expectRevert("AccessControl: account 0x0000000000000000000000000000000000000003 is missing role 0x77bcb06c914ee8a8c3b6f7b6e0e8a8c3b6f7b6e0e8a8c3b6f7b6e0e8a8c3b6f7b");
        proofOfRun.validateActivity(tokenId, true);
    }
}