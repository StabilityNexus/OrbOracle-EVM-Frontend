const OracleFactory = {
    "abi": [
        {
            "type": "constructor",
            "inputs": [
                {"name": "initialOwner", "type": "address", "internalType": "address"}
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "allOracles",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "tuple[]",
                    "internalType": "struct OracleFactory.OracleInfo[]",
                    "components": [
                        {"name": "oracle", "type": "address", "internalType": "address"},
                        {"name": "token", "type": "address", "internalType": "address"},
                        {"name": "creator", "type": "address", "internalType": "address"}
                    ]
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "createOracle",
            "inputs": [
                {"name": "name", "type": "string", "internalType": "string"},
                {"name": "description", "type": "string", "internalType": "string"},
                {"name": "weightToken", "type": "address", "internalType": "address"},
                {"name": "reward", "type": "uint256", "internalType": "uint256"},
                {"name": "halfLifeSeconds", "type": "uint256", "internalType": "uint256"},
                {"name": "quorum", "type": "uint256", "internalType": "uint256"},
                {"name": "depositLockingPeriod", "type": "uint256", "internalType": "uint256"},
                {"name": "withdrawalLockingPeriod", "type": "uint256", "internalType": "uint256"},
                {"name": "alpha", "type": "uint256", "internalType": "uint256"}
            ],
            "outputs": [
                {"name": "oracle", "type": "address", "internalType": "address"},
                {"name": "token", "type": "address", "internalType": "address"}
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "creatorOracleList",
            "inputs": [
                {"name": "creator", "type": "address", "internalType": "address"}
            ],
            "outputs": [
                {"name": "", "type": "address[]", "internalType": "address[]"}
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "creatorToOracle",
            "inputs": [
                {"name": "", "type": "address", "internalType": "address"},
                {"name": "", "type": "uint256", "internalType": "uint256"}
            ],
            "outputs": [
                {"name": "", "type": "address", "internalType": "address"}
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "oracles",
            "inputs": [
                {"name": "", "type": "uint256", "internalType": "uint256"}
            ],
            "outputs": [
                {"name": "oracle", "type": "address", "internalType": "address"},
                {"name": "token", "type": "address", "internalType": "address"},
                {"name": "creator", "type": "address", "internalType": "address"}
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                {"name": "", "type": "address", "internalType": "address"}
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
                {"name": "newOwner", "type": "address", "internalType": "address"}
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "OracleCreated",
            "inputs": [
                {"name": "oracle", "type": "address", "indexed": true, "internalType": "address"},
                {"name": "creator", "type": "address", "indexed": true, "internalType": "address"},
                {"name": "token", "type": "address", "indexed": false, "internalType": "address"}
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                {"name": "previousOwner", "type": "address", "indexed": true, "internalType": "address"},
                {"name": "newOwner", "type": "address", "indexed": true, "internalType": "address"}
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                {"name": "owner", "type": "address", "internalType": "address"}
            ]
        },
        {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                {"name": "account", "type": "address", "internalType": "address"}
            ]
        }
    ]
} as const;

export const OracleFactoryAbi = OracleFactory.abi;