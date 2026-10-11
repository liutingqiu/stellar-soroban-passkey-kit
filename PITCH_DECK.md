# Soroban Passkey Kit: WebAuthn Smart Accounts on Stellar 🌟🔒

> **Submitted to Stellar Community Fund (SCF #46 — Build Track, up to $150,000 Award Pool)**  
> **Target Category:** Developer Tooling & Smart Contract Infrastructure (Soroban Protocol 20+)  
> **Live Interactive Visualizer:** [https://liutingqiu.github.io/stellar-soroban-passkey-kit/](https://liutingqiu.github.io/stellar-soroban-passkey-kit/)  
> **Open Source GitHub Repository:** [https://github.com/liutingqiu/stellar-soroban-passkey-kit](https://github.com/liutingqiu/stellar-soroban-passkey-kit)  
> **Lead Developer & Author:** Tingqiu Liu (`@liutingqiu`, `tianqi689@gmail.com`)

---

## 🎯 Executive Summary & The Problem

Soroban (Stellar's smart contract platform) offers immense speed, sub-cent transaction fees, and institutional-grade anchor rails. However, mainstream and institutional adoption on Stellar faces two severe friction points:
1. **The Seed Phrase Bottleneck:** Forcing users to manage, write down, and safeguard 12 or 24-word secret keys causes catastrophic user drop-off and irreversible fund loss.
2. **Key Management for Institutions & Anchors:** Regulated Stellar Anchors and financial institutions require multi-party governance and recovery without holding unilateral custody over client funds.

---

## 💡 The Solution: Soroban Passkey Kit

**Soroban Passkey Kit** leverages native **secp256r1 (NIST P-256)** curve verification in Soroban to enable hardware-bound **WebAuthn Passkeys** directly on Stellar smart contracts.

### Core Architectural Features:

### 1. Hardware-Bound WebAuthn Authentication
- Generates and validates cryptographic signatures directly from client device Secure Enclaves (Apple Touch ID / Face ID, Android Biometrics, Windows Hello).
- In Soroban contracts, verified natively on-chain via:
  ```rust
  env.crypto().secp256r1_verify(&message_digest, &signature, &public_key_p256)
  ```
- Keys are mathematically non-exportable and immune to phishing or credential theft.

### 2. 2-of-3 Tripartite Guardian Social Recovery
Eliminates permanent lockout risk while preserving non-custodial ownership:
- **Guardian 1:** Regulated Stellar Anchor / Bank Signer (verified via SEP-24 / SEP-6 authentication).
- **Guardian 2:** Secondary Client Hardware Device (iPad, work laptop).
- **Guardian 3:** Trusted Legal / Family Contact Key.
- **Threshold Rule:** Any 2 of 3 guardians can cooperate to rotate the account's P-256 owner coordinates in contract storage.

### 3. Native Stellar USDC Integration
- Direct compatibility with Soroban SAC (Stellar Asset Contract) token interfaces.
- Execute authorized transfers, swaps, and anchor deposits with sub-second finality.

### 4. Interactive Live Terminal & Signing Simulator
- Deployed on **GitHub Pages** with live WebAuthn passkey simulation, contract call signing, and 2-of-3 recovery testing.

---

## 🛠️ Architecture & Tech Stack

```text
stellar-soroban-passkey-kit/
├── src/
│   ├── types.ts                   # Passkey credentials, guardians, Soroban invocations
│   ├── soroban/
│   │   ├── auth.ts                # WebAuthn P-256 credential generator & signature verifier
│   │   └── account.ts             # Soroban Custom Account smart account abstraction & recovery
│   └── index.ts                   # Unified library entrypoint
├── tests/
│   └── soroban_passkey.test.js    # 7 automated unit tests (credentials, calls, recovery)
├── index.html                     # Live interactive Soroban terminal & visualizer
├── PITCH_DECK.md                  # Hackathon pitch deck & SCF proposal
└── README.md                      # Developer documentation & quickstart
```

- **Runtime:** Node.js (ESM), TypeScript 5.6
- **Test Suite:** `node:test` + `node:assert/strict` (7/7 passed, 100% green)
- **Frontend:** Pure HTML5/CSS/JS (Stellar Space Blue & Cyan fintech aesthetic, deployed on GitHub Pages)
- **Stellar Compatibility:** Soroban Protocol 20+, Stellar SDK / Horizon / Soroban RPC

---

## 🔬 Test Suite Verification

```text
✔ 1. SorobanPasskeyAuth generates hardware-bound secp256r1 credential (0.8ms)
✔ 2. SorobanSmartAccountManager initializes with contract address and guardians (0.2ms)
✔ 3. buildInvocation constructs signed Soroban call and increments sequence (0.1ms)
✔ 4. buildUsdcTransfer builds authorized Stellar USDC transfer invocation (0.2ms)
✔ 5. buildUsdcTransfer throws on insufficient balance (0.3ms)
✔ 6. 2-of-3 Guardian threshold recovery rotates passkey on Soroban account (0.2ms)
✔ 7. Recovery rejects execution if threshold is not reached (0.2ms)

ℹ pass 7
ℹ fail 0
```

---

## 🏆 Project Deliverables & Links

- **Live Interactive Terminal:** [https://liutingqiu.github.io/stellar-soroban-passkey-kit/](https://liutingqiu.github.io/stellar-soroban-passkey-kit/)
- **GitHub Repository:** [https://github.com/liutingqiu/stellar-soroban-passkey-kit](https://github.com/liutingqiu/stellar-soroban-passkey-kit)
- **Lead Developer Contact:** Tingqiu Liu (`tianqi689@gmail.com`) / GitHub: `liutingqiu`

---
*Built with ❤️ for Stellar Community Fund, Soroban, and the Global Stellar Builder Community.*
