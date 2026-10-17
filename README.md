# Soroban Passkey Kit 🌟🔒

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/Tests-7%2F7%20Passed-brightgreen)](tests/soroban_passkey.test.js)
[![Stellar SCF](https://img.shields.io/badge/Stellar-SCF%20%2346%20%24150K-blue)](https://communityfund.stellar.org/awards)
[![Live Terminal](https://img.shields.io/badge/Live%20Terminal-GitHub%20Pages-success)](https://liutingqiu.github.io/stellar-soroban-passkey-kit/)

**Hardware-Bound WebAuthn Passkeys (secp256r1) and Custom Account Abstraction SDK on Stellar Soroban with 2-of-3 Anchor Social Recovery and USDC Transfers.**

Submitted the **SCF #46 interest form** (Build track, Open track) on **2026-10-17** — full proposal pending SDF invitation.

---

## 🌟 Overview

Mainstream Web3 adoption requires eliminating complex 24-word paper seed phrases. Leveraging Soroban Protocol 20+ native **secp256r1 (NIST P-256)** curve verification, **Soroban Passkey Kit** enables sovereign, non-custodial smart accounts authenticated directly through device biometrics (Apple Touch ID / Face ID, Windows Hello, Android Biometrics).

1. **Hardware-Bound Passkeys:** Keys live in client Secure Enclaves and never touch the network.
2. **2-of-3 Anchor Social Recovery:** Eliminates permanent account lockout with threshold governance across a regulated Stellar Anchor, backup device, and personal recovery key.
3. **Native Stellar USDC Integration:** 1-click contract calls for token transfers, swaps, and anchor deposits.
4. **Interactive Live Web Terminal:** Complete working simulator deployed on GitHub Pages.

---

## 🌐 Live Interactive Terminal

Experience the live Soroban passkey wallet simulator online:  
👉 **[https://liutingqiu.github.io/stellar-soroban-passkey-kit/](https://liutingqiu.github.io/stellar-soroban-passkey-kit/)**

---

## 📦 Quick Start & Usage

```bash
git clone https://github.com/liutingqiu/stellar-soroban-passkey-kit.git
cd stellar-soroban-passkey-kit
npm install
npm test
```

### TypeScript / ESM Example

```typescript
import {
  SorobanPasskeyAuth,
  SorobanSmartAccountManager
} from 'stellar-soroban-passkey-kit';

// 1. Generate WebAuthn P-256 Passkey Credential
const passkey = SorobanPasskeyAuth.createCredential('User Face ID');

// 2. Deploy Soroban Custom Smart Account
const manager = new SorobanSmartAccountManager(passkey);
const account = manager.getAccount();
console.log(`Soroban Contract ID: ${account.contractId}`);
console.log(`Mapped Stellar Address: ${account.stellarAddress}`);

// 3. Construct authorized Stellar USDC transfer
const recipient = 'GB2BHZX2SGCNNQVNC3CWSEHGWWJFIARVLDRAHED4IACUKRI5UCWZRN5R';
const transferCall = manager.buildUsdcTransfer(recipient, 500);

console.log(`Function: ${transferCall.functionName}`);
console.log(`Auth Signature: ${transferCall.authSignature}`);
```

---

## 🧪 Automated Test Suite

Run the unit tests covering secp256r1 credential generation, contract invocations, USDC transfer builds, and 2-of-3 threshold recovery:

```bash
node --test tests/soroban_passkey.test.js
```

Output:
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

## 📖 Hackathon Documentation

Read the full project pitch deck, architectural rationale, and SCF proposal:  
👉 **[PITCH_DECK.md](PITCH_DECK.md)**

---

## 📄 License

Released under the [MIT License](LICENSE).

