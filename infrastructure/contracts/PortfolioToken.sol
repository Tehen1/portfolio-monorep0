// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title PortfolioToken
 * @dev Cross-Domain Utility Token with AI Integration for Multi-Domain Portfolio
 * @notice Implements ERC20 with advanced features for cross-domain rewards and AI optimization
 */
contract PortfolioToken is ERC20, AccessControl, ReentrancyGuard {
    using ECDSA for bytes32;

    bytes32 public constant AI_ORACLE_ROLE = keccak256("AI_ORACLE_ROLE");
    bytes32 public constant DOMAIN_ADMIN_ROLE = keccak256("DOMAIN_ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    struct DomainActivity {
        uint256 mushrooms;     // adaptogenic-mushrooms.com
        uint256 fitness;       // fixie.run
        uint256 music;         // rhymechain.win
        uint256 seo;          // seobiz.be
        uint256 dating;       // affinitylove.eu
    }

    struct AIOptimization {
        uint256 timestamp;
        uint256 performanceScore;
        uint256 engagementBoost;
        bool automated;
        bytes32 optimizationHash;
    }

    // Constants
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens
    uint256 public constant AI_OPTIMIZATION_BONUS = 5; // 5% bonus for AI-optimized actions
    uint256 public constant CROSS_DOMAIN_BONUS_PERCENTAGE = 10; // 10% per additional domain
    uint256 public constant STAKING_REWARD_RATE = 15; // 15% APY for staking
    uint256 public constant REWARD_COOLDOWN = 24 hours; // Prevent reward spam

    // State variables
    mapping(address => DomainActivity) public userDomainActivity;
    mapping(address => AIOptimization[]) public userOptimizations;
    mapping(address => uint256) public totalRewards;
    mapping(bytes32 => bool) public processedTransactions;
    mapping(address => uint256) public lastRewardClaim;
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingStartTime;

    // Cross-domain synergy tracking
    mapping(address => uint256) public crossDomainScore;
    mapping(bytes32 => bool) public domainSynergies;
    mapping(address => uint256) public aiOptimizationScore;

    // Events
    event DomainReward(address indexed user, string domain, uint256 amount, bool aiOptimized);
    event AIOptimizationApplied(address indexed user, uint256 bonus, bytes32 optimizationHash);
    event CrossDomainMilestone(address indexed user, uint256 domains, uint256 bonus);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 reward);
    event SynergyReward(address indexed user, bytes32 synergyHash, uint256 reward);

    /**
     * @dev Constructor to initialize the PortfolioToken
     */
    constructor()
        ERC20("PortfolioToken", "PTF")
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(AI_ORACLE_ROLE, msg.sender);
        _setupRole(DOMAIN_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);

        // Mint initial supply (20% of total supply)
        _mint(msg.sender, MAX_SUPPLY * 20 / 100);
    }

    /**
     * @dev Distribute domain rewards with AI optimization bonus
     * @param user Address of the user receiving rewards
     * @param domain Domain name for the activity
     * @param amount Base reward amount
     * @param aiOptimized Whether the action was AI-optimized
     */
    function distributeDomainRewards(
        address user,
        string calldata domain,
        uint256 amount,
        bool aiOptimized
    ) external onlyRole(DOMAIN_ADMIN_ROLE) nonReentrant {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Invalid amount");
        require(amount <= 1000000 * 10**18, "Amount too large"); // Max 1M tokens per transaction

        // Prevent reward spam
        require(block.timestamp >= lastRewardClaim[user] + REWARD_COOLDOWN, "Reward cooldown active");
        lastRewardClaim[user] = block.timestamp;

        // Create transaction hash to prevent duplicates
        bytes32 domainHash = keccak256(abi.encodePacked(user, domain, amount, block.timestamp));
        require(!processedTransactions[domainHash], "Transaction already processed");

        // Calculate base reward
        uint256 rewardAmount = amount;

        // Apply AI optimization bonus
        if (aiOptimized) {
            uint256 aiBonus = rewardAmount * AI_OPTIMIZATION_BONUS / 100;
            rewardAmount += aiBonus;
            emit AIOptimizationApplied(user, aiBonus, domainHash);
        }

        // Update domain-specific activity
        _updateDomainActivity(user, domain, rewardAmount);

        // Check for cross-domain milestone bonuses
        uint256 activeDomains = _countActiveDomains(userDomainActivity[user]);
        if (activeDomains >= 3) {
            uint256 milestoneBonus = rewardAmount * activeDomains * CROSS_DOMAIN_BONUS_PERCENTAGE / 100;
            rewardAmount += milestoneBonus;
            crossDomainScore[user] = activeDomains;
            emit CrossDomainMilestone(user, activeDomains, milestoneBonus);
        }

        // Update total rewards and mint tokens
        totalRewards[user] += rewardAmount;
        _mint(user, rewardAmount);

        // Mark transaction as processed
        processedTransactions[domainHash] = true;

        emit DomainReward(user, domain, rewardAmount, aiOptimized);

        // Check for domain synergies
        _checkAndRewardSynergies(user, domain);
    }

    /**
     * @dev Record AI optimization for user
     * @param user Address of the user
     * @param performanceScore Performance improvement score (0-100)
     * @param engagementBoost Engagement boost percentage
     * @param optimizationHash Hash of the optimization data
     */
    function recordAIOptimization(
        address user,
        uint256 performanceScore,
        uint256 engagementBoost,
        bytes32 optimizationHash
    ) external onlyRole(AI_ORACLE_ROLE) {
        require(user != address(0), "Invalid user address");
        require(performanceScore <= 100, "Invalid performance score");
        require(!processedTransactions[optimizationHash], "Optimization already recorded");

        userOptimizations[user].push(AIOptimization({
            timestamp: block.timestamp,
            performanceScore: performanceScore,
            engagementBoost: engagementBoost,
            automated: true,
            optimizationHash: optimizationHash
        }));

        // Update AI optimization score
        aiOptimizationScore[user] = (aiOptimizationScore[user] + performanceScore) / 2;

        processedTransactions[optimizationHash] = true;
    }

    /**
     * @dev Stake tokens for rewards
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // If already staking, claim existing rewards first
        if (stakedBalance[msg.sender] > 0) {
            _claimStakingRewards(msg.sender);
        }

        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);

        // Update staking info
        stakedBalance[msg.sender] += amount;
        stakingStartTime[msg.sender] = block.timestamp;

        emit TokensStaked(msg.sender, amount);
    }

    /**
     * @dev Unstake tokens and claim rewards
     */
    function unstake() external nonReentrant {
        require(stakedBalance[msg.sender] > 0, "No tokens staked");

        uint256 stakedAmount = stakedBalance[msg.sender];
        uint256 reward = _calculateStakingReward(msg.sender);

        // Reset staking info
        stakedBalance[msg.sender] = 0;
        stakingStartTime[msg.sender] = 0;

        // Transfer staked tokens back
        _transfer(address(this), msg.sender, stakedAmount);

        // Mint reward tokens
        if (reward > 0) {
            _mint(msg.sender, reward);
        }

        emit TokensUnstaked(msg.sender, stakedAmount, reward);
    }

    /**
     * @dev Claim staking rewards without unstaking
     */
    function claimStakingRewards() external nonReentrant {
        require(stakedBalance[msg.sender] > 0, "No tokens staked");

        uint256 reward = _calculateStakingReward(msg.sender);

        if (reward > 0) {
            // Reset staking start time to continue earning
            stakingStartTime[msg.sender] = block.timestamp;
            _mint(msg.sender, reward);
        }
    }

    /**
     * @dev Get comprehensive user summary
     * @param user Address of the user
     */
    function getUserSummary(address user) external view returns (
        uint256 totalRewardsEarned,
        uint256 currentBalance,
        uint256 stakedAmount,
        uint256 pendingStakingRewards,
        uint256 aiScore,
        uint256 crossDomainScore_,
        DomainActivity memory activity,
        uint256 optimizationCount
    ) {
        totalRewardsEarned = totalRewards[user];
        currentBalance = balanceOf(user);
        stakedAmount = stakedBalance[user];
        pendingStakingRewards = _calculateStakingReward(user);
        aiScore = aiOptimizationScore[user];
        crossDomainScore_ = crossDomainScore[user];
        activity = userDomainActivity[user];
        optimizationCount = userOptimizations[user].length;
    }

    /**
     * @dev Get user's optimization history
     * @param user Address of the user
     * @param limit Maximum number of optimizations to return
     */
    function getUserOptimizations(address user, uint256 limit) external view returns (
        uint256[] memory timestamps,
        uint256[] memory performanceScores,
        uint256[] memory engagementBoosts,
        bytes32[] memory optimizationHashes
    ) {
        uint256 count = userOptimizations[user].length;
        if (limit > count) limit = count;

        timestamps = new uint256[](limit);
        performanceScores = new uint256[](limit);
        engagementBoosts = new uint256[](limit);
        optimizationHashes = new bytes32[](limit);

        for (uint256 i = 0; i < limit; i++) {
            AIOptimization memory opt = userOptimizations[user][count - 1 - i];
            timestamps[i] = opt.timestamp;
            performanceScores[i] = opt.performanceScore;
            engagementBoosts[i] = opt.engagementBoost;
            optimizationHashes[i] = opt.optimizationHash;
        }
    }

    // ============ INTERNAL FUNCTIONS ============

    /**
     * @dev Update domain-specific activity
     */
    function _updateDomainActivity(address user, string memory domain, uint256 amount) internal {
        bytes32 domainHash = keccak256(bytes(domain));

        if (domainHash == keccak256("adaptogenic-mushrooms.com") || domainHash == keccak256("mushrooms")) {
            userDomainActivity[user].mushrooms += amount;
        } else if (domainHash == keccak256("fixie.run") || domainHash == keccak256("fitness")) {
            userDomainActivity[user].fitness += amount;
        } else if (domainHash == keccak256("rhymechain.win") || domainHash == keccak256("music")) {
            userDomainActivity[user].music += amount;
        } else if (domainHash == keccak256("seobiz.be") || domainHash == keccak256("seo")) {
            userDomainActivity[user].seo += amount;
        } else if (domainHash == keccak256("affinitylove.eu") || domainHash == keccak256("dating")) {
            userDomainActivity[user].dating += amount;
        }
    }

    /**
     * @dev Count active domains for a user
     */
    function _countActiveDomains(DomainActivity memory activity) internal pure returns (uint256) {
        uint256 count = 0;
        if (activity.mushrooms > 0) count++;
        if (activity.fitness > 0) count++;
        if (activity.music > 0) count++;
        if (activity.seo > 0) count++;
        if (activity.dating > 0) count++;
        return count;
    }

    /**
     * @dev Calculate staking rewards
     */
    function _calculateStakingReward(address user) internal view returns (uint256) {
        if (stakedBalance[user] == 0 || stakingStartTime[user] == 0) return 0;

        uint256 stakingDuration = block.timestamp - stakingStartTime[user];
        uint256 annualReward = stakedBalance[user] * STAKING_REWARD_RATE / 100;
        uint256 reward = annualReward * stakingDuration / 365 days;

        return reward;
    }

    /**
     * @dev Check for and reward domain synergies
     */
    function _checkAndRewardSynergies(address user, string memory domain) internal {
        bytes32 synergyHash = keccak256(abi.encodePacked(user, domain, block.timestamp));

        // Example synergy: Mushroom + Fitness (wellness synergy)
        bool hasMushroomActivity = userDomainActivity[user].mushrooms > 0;
        bool hasFitnessActivity = userDomainActivity[user].fitness > 0;

        if (hasMushroomActivity && hasFitnessActivity && !domainSynergies[synergyHash]) {
            uint256 synergyReward = 1000 * 10**18; // 1000 tokens for synergy
            _mint(user, synergyReward);
            domainSynergies[synergyHash] = true;
            emit SynergyReward(user, synergyHash, synergyReward);
        }

        // Add more synergy checks as needed
    }

    // ============ OVERRIDE FUNCTIONS ============

    /**
     * @dev Override _mint to enforce max supply
     */
    function _mint(address account, uint256 amount) internal override {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        super._mint(account, amount);
    }

    /**
     * @dev Override transfer to include staking balance check
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(balanceOf(msg.sender) - stakedBalance[msg.sender] >= amount, "Insufficient unstaked balance");
        return super.transfer(to, amount);
    }

    /**
     * @dev Override transferFrom to include staking balance check
     */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(balanceOf(from) - stakedBalance[from] >= amount, "Insufficient unstaked balance");
        return super.transferFrom(from, to, amount);
    }
}
