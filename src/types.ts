// SPDX-License-Identifier: MIT

export interface SorobanPasskeyCredential {
  credentialId: string;
  publicKeyX: string;        // 32-byte hex string representing P-256 coordinate X
  publicKeyY: string;        // 32-byte hex string representing P-256 coordinate Y
  algorithm: 'secp256r1';    // NIST P-256 curve natively supported in Soroban Protocol 21+
  signCount: number;
  createdAt: number;
}

export type SorobanGuardianType = 'INSTITUTIONAL_ANCHOR' | 'BACKUP_DEVICE' | 'TRUSTED_PEER';

export interface SorobanGuardian {
  id: string;
  name: string;
  type: SorobanGuardianType;
  stellarPublicKey: string; // G... format address
  approved: boolean;
}

export interface SorobanSmartAccount {
  contractId: string;       // C... format Soroban contract address
  stellarAddress: string;   // G... format Stellar account mapping
  ownerCredential: SorobanPasskeyCredential;
  guardians: SorobanGuardian[];
  recoveryThreshold: number; // e.g. 2-of-3 threshold
  sequenceNumber: number;
  usdcBalance: number;
  xlmBalance: number;
}

export interface SorobanInvocation {
  contractId: string;
  functionName: string;
  args: unknown[];
  authSignature: string;     // P-256 WebAuthn signature
  sequenceNumber: number;
  maxFeeXLM: number;
}

export interface SorobanRecoverySession {
  sessionId: string;
  contractId: string;
  proposedCredential: SorobanPasskeyCredential;
  approvals: string[];       // Guardian IDs who approved
  thresholdRequired: number;
  isExecuted: boolean;
  createdAt: number;
}
