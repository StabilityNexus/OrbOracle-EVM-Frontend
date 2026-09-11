const ComposedOracleFactory = {
  "abi": [
    {
      "type": "constructor",
      "inputs": [
        { "name": "initialOwner", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "allComposedOracles",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct ComposedOracleFactory.ComposedOracleInfo[]",
          "components": [
            { "name": "oracle", "type": "address", "internalType": "address" },
            { "name": "feedA", "type": "address", "internalType": "address" },
            { "name": "feedB", "type": "address", "internalType": "address" },
            { "name": "operation", "type": "uint8", "internalType": "uint8" },
            { "name": "creator", "type": "address", "internalType": "address" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "createComposedOracle",
      "inputs": [
        { "name": "feedA", "type": "address", "internalType": "address" },
        { "name": "feedB", "type": "address", "internalType": "address" },
        { "name": "operation", "type": "uint8", "internalType": "uint8" },
        { "name": "invertResult", "type": "bool", "internalType": "bool" },
        { "name": "defaultSampleSize", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "oracle", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "creatorComposedOracleList",
      "inputs": [
        { "name": "creator", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "address[]", "internalType": "address[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "composedOracles",
      "inputs": [
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "oracle", "type": "address", "internalType": "address" },
        { "name": "feedA", "type": "address", "internalType": "address" },
        { "name": "feedB", "type": "address", "internalType": "address" },
        { "name": "operation", "type": "uint8", "internalType": "uint8" },
        { "name": "creator", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "creatorToComposedOracles",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "newOwner", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "ComposedOracleCreated",
      "inputs": [
        { "name": "oracle", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "creator", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "feedA", "type": "address", "indexed": false, "internalType": "address" },
        { "name": "feedB", "type": "address", "indexed": false, "internalType": "address" },
        { "name": "operation", "type": "uint8", "indexed": false, "internalType": "uint8" }
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
    { "type": "error", "name": "InvalidFeed", "inputs": [] },
    { "type": "error", "name": "InvalidOperation", "inputs": [] },
    { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }
  ]
} as const;

export const ComposedOracleFactoryAbi = ComposedOracleFactory.abi;
