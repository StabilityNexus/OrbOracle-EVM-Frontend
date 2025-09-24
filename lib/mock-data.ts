export interface Oracle {
  id: string
  name: string
  description: string
  category: string
  dataSource: string
  price: string
  updateFrequency: string
  accuracy: string
  totalRequests: number
  creator: string
  createdAt: string
  status: "active" | "inactive" | "maintenance"
  chains: string[]
  lastUpdate: string
}

export const mockOracles: Oracle[] = [
  {
    id: "eth-usd-price",
    name: "ETH/USD Price Feed",
    description: "Real-time Ethereum to USD price data aggregated from multiple exchanges",
    category: "Price Feeds",
    dataSource: "Binance, Coinbase, Kraken",
    price: "0.1 ETH",
    updateFrequency: "30 seconds",
    accuracy: "99.95%",
    totalRequests: 1247832,
    creator: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    createdAt: "2024-01-15",
    status: "active",
    chains: ["Ethereum", "Polygon", "Arbitrum"],
    lastUpdate: "2 minutes ago",
  },
  {
    id: "btc-dominance",
    name: "Bitcoin Dominance Index",
    description: "Bitcoin market dominance percentage in the cryptocurrency market",
    category: "Market Data",
    dataSource: "CoinGecko, CoinMarketCap",
    price: "0.05 ETH",
    updateFrequency: "5 minutes",
    accuracy: "99.8%",
    totalRequests: 892341,
    creator: "0x8ba1f109551bD432803012645Hac189451c9",
    createdAt: "2024-02-03",
    status: "active",
    chains: ["Ethereum", "BSC"],
    lastUpdate: "1 minute ago",
  },
  {
    id: "weather-nyc",
    name: "NYC Weather Oracle",
    description: "Real-time weather data for New York City including temperature, humidity, and conditions",
    category: "Weather",
    dataSource: "OpenWeatherMap, WeatherAPI",
    price: "0.02 ETH",
    updateFrequency: "15 minutes",
    accuracy: "98.5%",
    totalRequests: 456789,
    creator: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    createdAt: "2024-01-28",
    status: "active",
    chains: ["Ethereum", "Polygon"],
    lastUpdate: "5 minutes ago",
  },
  {
    id: "gold-price",
    name: "Gold Spot Price",
    description: "Live gold spot price in USD per troy ounce from precious metals markets",
    category: "Commodities",
    dataSource: "LBMA, COMEX",
    price: "0.08 ETH",
    updateFrequency: "1 minute",
    accuracy: "99.9%",
    totalRequests: 234567,
    creator: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    createdAt: "2024-02-10",
    status: "maintenance",
    chains: ["Ethereum"],
    lastUpdate: "1 hour ago",
  },
  {
    id: "random-number",
    name: "Verifiable Random Number",
    description: "Cryptographically secure random number generation for gaming and DeFi applications",
    category: "Randomness",
    dataSource: "Chainlink VRF, drand",
    price: "0.15 ETH",
    updateFrequency: "On-demand",
    accuracy: "100%",
    totalRequests: 789123,
    creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    createdAt: "2024-01-20",
    status: "active",
    chains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
    lastUpdate: "30 seconds ago",
  },
  {
    id: "sports-scores",
    name: "NBA Live Scores",
    description: "Real-time NBA game scores, player stats, and match results",
    category: "Sports",
    dataSource: "ESPN API, NBA Official",
    price: "0.03 ETH",
    updateFrequency: "Real-time",
    accuracy: "99.99%",
    totalRequests: 345678,
    creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    createdAt: "2024-02-05",
    status: "inactive",
    chains: ["Ethereum", "Polygon"],
    lastUpdate: "2 hours ago",
  },
]

export const categories = [
  "All Categories",
  "Price Feeds",
  "Market Data",
  "Weather",
  "Commodities",
  "Randomness",
  "Sports",
]

export const chains = ["All Chains", "Ethereum", "Polygon", "Arbitrum", "Optimism", "BSC"]
