<!-- Don't delete it -->
<div name="readme-top"></div>

<!-- Organization Logo -->
<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 16px;">
  <img alt="Stability Nexus" src="public/stability.svg" width="175">
</div>

&nbsp;

<!-- Organization Name -->
<div align="center">

[![Static Badge](https://img.shields.io/badge/Stability_Nexus-Orb_Oracle-228B22?style=for-the-badge&labelColor=FFC517)](https://stability.nexus/)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/StabilityNexus/OrbOracle-EVM-Frontend/badge)](https://scorecard.dev/viewer/?uri=github.com/StabilityNexus/OrbOracle-EVM-Frontend)

</div>

<!-- Organization/Project Social Handles -->
<p align="center">
<!-- Telegram -->
<a href="https://t.me/StabilityNexus">
<img src="https://img.shields.io/badge/Telegram-black?style=flat&logo=telegram&logoColor=white&logoSize=auto&color=24A1DE" alt="Telegram Badge"/></a>
&nbsp;&nbsp;
<!-- X (formerly Twitter) -->
<a href="https://x.com/StabilityNexus">
<img src="https://img.shields.io/twitter/follow/StabilityNexus" alt="X (formerly Twitter) Badge"/></a>
&nbsp;&nbsp;
<!-- Discord -->
<a href="https://discord.gg/YzDKeEfWtS">
<img src="https://img.shields.io/discord/995968619034984528?style=flat&logo=discord&logoColor=white&logoSize=auto&label=Discord&labelColor=5865F2&color=57F287" alt="Discord Badge"/></a>
&nbsp;&nbsp;
<!-- Medium -->
<a href="https://news.stability.nexus/">
  <img src="https://img.shields.io/badge/Medium-black?style=flat&logo=medium&logoColor=black&logoSize=auto&color=white" alt="Medium Badge"></a>
&nbsp;&nbsp;
<!-- LinkedIn -->
<a href="https://linkedin.com/company/stability-nexus">
  <img src="https://img.shields.io/badge/LinkedIn-black?style=flat&logo=LinkedIn&logoColor=white&logoSize=auto&color=0A66C2" alt="LinkedIn Badge"></a>
&nbsp;&nbsp;
<!-- Youtube -->
<a href="https://www.youtube.com/@StabilityNexus">
  <img src="https://img.shields.io/youtube/channel/subscribers/UCZOG4YhFQdlGaLugr_e5BKw?style=flat&logo=youtube&logoColor=white&logoSize=auto&labelColor=FF0000&color=FF0000" alt="Youtube Badge"></a>
</p>

---

<div align="center">
<h1>Orb Oracle EVM Frontend</h1>
</div>

The decentralized user interface for the Orb Oracle protocol. It allows users to browse active data feeds, submit price values to base oracles (governance-backed), deploy new base or composed oracle instances, and monitor time-weighted price intervals directly on-chain.

---

## Tech Stack

### Frontend
- **Next.js 14+** (React App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **GSAP** (Smooth animations and layout transitions)

### Blockchain Integration
- **Wagmi & Viem** for type-safe EVM interactions
- **RainbowKit** for wallet connections
- **Solidity Smart Contracts** (via factory configurations)

---

## Getting Started

### Prerequisites

- **Node.js 18+** installed on your system
- A package manager (**npm**, **yarn**, or **pnpm**)
- A Web3 wallet browser extension (e.g. MetaMask, Rabby) connected to Ethereum Sepolia Testnet

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/OrbOracle-EVM-Frontend.git
cd OrbOracle-EVM-Frontend
```

#### 2. Install Dependencies

Using your preferred package manager:

```bash
npm install
```

#### 3. Run the Development Server

Start the app locally:

```bash
npm run dev
```

#### 4. Open your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## Contributing

We welcome contributions of all kinds! Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) for full setup instructions, Git workflow guidelines, and code quality standards.

If you encounter bugs, need help, or have feature requests:
- Please open an issue in this repository providing detailed information.
- Describe the problem clearly and include any relevant logs or screenshots.

We appreciate your feedback and contributions!

© 2026 The Stable Order.
