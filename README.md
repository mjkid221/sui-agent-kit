# Sui Agent Kit 🌊

An open-source toolkit for connecting AI agents to the Sui blockchain ecosystem, powering Mizu AI - your intelligent copilot for all Sui needs. This toolkit enables any AI agent to seamlessly interact with Sui's powerful features and protocols.

![License](https://img.shields.io/github/license/mjkid221/sui-agent-kit?style=for-the-badge)

## 🎯 Vision

Sui Agent Kit aims to democratize blockchain interaction by providing a robust framework that bridges AI capabilities with Sui's ecosystem. As the foundation for Mizu AI, it empowers developers to create intelligent agents that can autonomously interact with Sui's blockchain features and protocols.

## 🔧 Core Features

### Native Sui Operations
- Token Operations
  - Deploy new coins with customizable parameters
  - Fixed/dynamic supply management
  - Token transfers and balance checks
- Transaction Management
  - Sign and execute transactions
  - Transaction status monitoring
  - Gas optimization

### Protocol Integrations
- **Cetus**: DEX operations and liquidity management
- **SuiLend**: Lending and borrowing capabilities
- **FlowX**: Trading and exchange features
- **SuiNS**: Domain name service integration
- **GoPlusLabs**: Security and analytics tools

## 💻 Installation

```bash
npm install sui-agent-kit
# or
yarn add sui-agent-kit
```

## 🚀 Quick Start

```typescript
import { SuiAgentKit } from 'sui-agent-kit';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Initialize the agent with your wallet
const wallet = new Ed25519Keypair();
const agent = new SuiAgentKit(wallet, {
  network: 'mainnet', // or 'testnet'
  config: {
    coinDeployFixedFee: 0.5, // Optional: Fixed fee for coin deployment (in SUI)
    tradeCommissionFeePercentage: 1, // Optional: Trade commission percentage
    treasury: 'YOUR_TREASURY_ADDRESS', // Optional: Treasury address for fees
  }
});
```

### Deploy a New Coin

```typescript
const tokenInfo = {
  name: "My AI Token",
  symbol: "MAT",
  decimals: 9,
  totalSupply: 1_000_000_000, // 1 billion
  fixedSupply: true,
  description: "An AI-powered token on Sui"
};

const moduleAddress = await agent.requestDeployCoin(tokenInfo);
console.log("Token deployed at:", moduleAddress);
```

### Execute Transactions

```typescript
const transaction = // ... your transaction
const txHash = await agent.signExecuteAndWaitForTransaction(transaction);
console.log("Transaction executed:", txHash);
```

## 🔐 Caching Configuration

The toolkit supports multiple caching strategies for optimal performance:

```typescript
const agent = new SuiAgentKit(wallet, {
  cache: {
    cacheStoreType: "redis", // "redis" | "lru" | "memory"
    externalDbUrl: "redis://localhost:6379",
    namespace: "my-cache"
  }
});
```

## 🤖 AI Integration

Sui Agent Kit is designed to work seamlessly with AI models and frameworks:

- **LangChain Compatible**: Built-in tools and agents for LangChain integration
- **Streaming Responses**: Real-time feedback for AI interactions
- **Context Management**: Efficient handling of blockchain state and AI context
- **Autonomous Operations**: Support for both guided and autonomous agent actions

## 🤝 Contributing

We welcome contributions from the community! Whether it's adding new features, fixing bugs, or improving documentation, please feel free to make a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Powered by Mizu AI

Sui Agent Kit is the foundation of [Mizu AI](https://github.com/mjkid221/mizu-network), your intelligent copilot for all Sui blockchain needs. Stay tuned for more updates and features!