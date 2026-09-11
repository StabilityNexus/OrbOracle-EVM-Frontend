export const ComposedOracleAbi = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "_feedA", "type": "address", "internalType": "address" },
      { "name": "_feedB", "type": "address", "internalType": "address" },
      { "name": "_invertResult", "type": "bool", "internalType": "bool" },
      { "name": "_defaultSampleSize", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },

  // Public immutable config
  { "type": "function", "name": "feedA", "inputs": [], "outputs": [{ "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "feedB", "inputs": [], "outputs": [{ "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "invertResult", "inputs": [], "outputs": [{ "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "defaultSampleSize", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },

  // Core view actions
  { "type": "function", "name": "readValue", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "readLatestValue", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  {
    "type": "function",
    "name": "readValueInterval",
    "inputs": [],
    "outputs": [
      { "name": "minValue", "type": "uint256", "internalType": "uint256" },
      { "name": "maxValue", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  { "type": "function", "name": "lastUpdated", "inputs": [], "outputs": [{ "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "isBlacklisted", "inputs": [{ "name": "target", "type": "address", "internalType": "address" }], "outputs": [{ "type": "bool", "internalType": "bool" }], "stateMutability": "view" },

  // Errors
  { "type": "error", "name": "DivisionByZero", "inputs": [] },
  { "type": "error", "name": "InvalidFeedAddress", "inputs": [] },
  { "type": "error", "name": "BlacklistedCaller", "inputs": [] },
  { "type": "error", "name": "EmptyHistory", "inputs": [] },
  { "type": "error", "name": "InvalidSampleSize", "inputs": [] }
] as const;
