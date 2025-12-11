// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../contracts/ProofOfRun.sol";

contract MultiChainDeploy is Script {
    // Deploy UUPS proxy for ProofOfRun
    function run() external {
        address admin = vm.envAddress("ADMIN_ADDRESS");
        address minter = vm.envAddress("MINTER_ADDRESS");

        vm.startBroadcast();

        // Deploy implementation
        ProofOfRun implementation = new ProofOfRun();

        // Deploy proxy with initialize call
        bytes memory initData = abi.encodeCall(ProofOfRun.initialize, (admin, minter));
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);

        vm.stopBroadcast();

        console.log("ProofOfRun deployed at:", address(proxy));
    }
}