export const OracleAbi = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "owner_", "type": "address", "internalType": "address" },
      { "name": "name_", "type": "string", "internalType": "string" },
      { "name": "description_", "type": "string", "internalType": "string" },
      { "name": "weightToken_", "type": "address", "internalType": "address" },
      { "name": "reward_", "type": "uint256", "internalType": "uint256" },
      { "name": "halfLifeSeconds_", "type": "uint256", "internalType": "uint256" },
      { "name": "quorum_", "type": "uint256", "internalType": "uint256" },
      { "name": "depositLockingPeriod_", "type": "uint256", "internalType": "uint256" },
      { "name": "withdrawalLockingPeriod_", "type": "uint256", "internalType": "uint256" },
      { "name": "alpha_", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  { "type": "receive", "stateMutability": "payable" },

  // Immutable/public config
  { "type": "function", "name": "ALPHA", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "DEPOSIT_LOCKING_PERIOD", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "WITHDRAWAL_LOCKING_PERIOD", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "REWARD", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "HALF_LIFE_SECONDS", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "QUORUM", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },

  // Public vars
  { "type": "function", "name": "WEIGHT_TOKEN", "inputs": [], "outputs": [{ "type": "address", "internalType": "contract IERC20" }], "stateMutability": "view" },
  { "type": "function", "name": "name", "inputs": [], "outputs": [{ "type": "string", "internalType": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "description", "inputs": [], "outputs": [{ "type": "string", "internalType": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "totalDepositedTokens", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },

  // Ether funding helper
  { "type": "function", "name": "deposit", "inputs": [], "outputs": [], "stateMutability": "payable" },

  // Token deposit/lock state (public mappings)
  { "type": "function", "name": "lockedTokens", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "unlockedTokens", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "lockedForWithdrawal", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "depositTimestamp", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "lastOperationTimestamp", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },

  // Price storage (public)
  { "type": "function", "name": "priceHistory", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "type": "int256", "internalType": "int256" }], "stateMutability": "view" },
  { "type": "function", "name": "latestValueHistory", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "type": "int256", "internalType": "int256" }], "stateMutability": "view" },
  { "type": "function", "name": "priceTimestamps", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },

  // Time markers
  { "type": "function", "name": "lastSubmissionTime", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "lastTimestamp", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },

  // Core actions
  { "type": "function", "name": "submitValue", "inputs": [{ "name": "newValue", "type": "int256", "internalType": "int256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "readValue", "inputs": [], "outputs": [{ "type": "int256", "internalType": "int256" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "readLatestValue", "inputs": [], "outputs": [{ "type": "int256", "internalType": "int256" }], "stateMutability": "nonpayable" },

  // Token flows
  { "type": "function", "name": "depositTokens", "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "withdrawTokens", "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },

  // Governance
  { "type": "function", "name": "voteBlacklist", "inputs": [{ "name": "target", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "voteWhitelist", "inputs": [{ "name": "target", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  {
    "type": "function",
    "name": "getVotes",
    "inputs": [{ "name": "target", "type": "address", "internalType": "address" }],
    "outputs": [
      { "name": "blacklistVotesCount", "type": "uint256", "internalType": "uint256" },
      { "name": "whitelistVotesCount", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  { "type": "function", "name": "isBlacklisted", "inputs": [{ "name": "target", "type": "address", "internalType": "address" }], "outputs": [{ "type": "bool", "internalType": "bool" }], "stateMutability": "view" },

  // Price history helpers
  {
    "type": "function",
    "name": "getPriceHistoryRange",
    "inputs": [
      { "name": "startIndex", "type": "uint256", "internalType": "uint256" },
      { "name": "endIndex", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "timestamps", "type": "uint256[]", "internalType": "uint256[]" },
      { "name": "aggregatedPrices", "type": "int256[]", "internalType": "int256[]" },
      { "name": "latestValues", "type": "int256[]", "internalType": "int256[]" }
    ],
    "stateMutability": "view"
  },
  { "type": "function", "name": "getPriceHistoryLength", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },

  // Token accounting helpers
  { "type": "function", "name": "getTotalUserTokens", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  {
    "type": "function",
    "name": "getTokenBreakdown",
    "inputs": [{ "name": "user", "type": "address", "internalType": "address" }],
    "outputs": [
      { "name": "locked", "type": "uint256", "internalType": "uint256" },
      { "name": "unlocked", "type": "uint256", "internalType": "uint256" },
      { "name": "lockedForWithdrawalAmount", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },

  // Submitter info
  {
    "type": "function",
    "name": "getSubmitterInfo",
    "inputs": [{ "name": "submitter", "type": "address", "internalType": "address" }],
    "outputs": [
      { "name": "lastSubmittedPrice", "type": "int256", "internalType": "int256" },
      { "name": "lastWeight", "type": "uint256", "internalType": "uint256" },
      { "name": "lastSubmittedTime", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },

  // Ownable
  { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },

  // Events
  {
    "type": "event",
    "name": "PriceSubmitted",
    "inputs": [
      { "name": "submitter", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "timestamp", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "submittedValue", "type": "int256", "indexed": false, "internalType": "int256" },
      { "name": "aggregatedPrice", "type": "int256", "indexed": false, "internalType": "int256" },
      { "name": "weight", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "rewardWei", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Funded",
    "inputs": [
      { "name": "from", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokenDeposited",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokenWithdrawn",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Voted",
    "inputs": [
      { "name": "target", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "voter", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "isBlacklist", "type": "bool", "indexed": false, "internalType": "bool" },
      { "name": "weight", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BlacklistStatusChanged",
    "inputs": [
      { "name": "target", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "isBlacklisted", "type": "bool", "indexed": false, "internalType": "bool" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      { "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },

  // Errors
  { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }
] as const;
