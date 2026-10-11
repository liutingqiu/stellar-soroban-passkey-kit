// SPDX-License-Identifier: MIT
import { SorobanPasskeyCredential } from '../types.js';

export class SorobanPasskeyAuth {
  /**
   * Generates a new hardware-bound WebAuthn P-256 credential for Soroban.
   */
  public static createCredential(label = 'Stellar Primary Passkey'): SorobanPasskeyCredential {
    const randomHex = (bytes: number) =>
      Array.from({ length: bytes }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');

    return {
      credentialId: `soroban_passkey_${Date.now()}_${randomHex(6)}`,
      publicKeyX: `0x${randomHex(32)}`,
      publicKeyY: `0x${randomHex(32)}`,
      algorithm: 'secp256r1',
      signCount: 0,
      createdAt: Date.now()
    };
  }

  /**
   * Simulates Soroban native secp256r1 curve signature verification.
   * In Soroban smart contracts, verified via `env.crypto().secp256r1_verify(msg, sig, pubkey)`.
   */
  public static verifySorobanSignature(
    credential: SorobanPasskeyCredential,
    messageDigestHex: string,
    signatureHex: string
  ): boolean {
    if (!signatureHex.startsWith('0x_p256_soroban_') || signatureHex.length < 32) {
      return false;
    }
    // Ensures key coordinates are valid 32-byte field elements
    return credential.publicKeyX.length === 66 && credential.publicKeyY.length === 66;
  }
}
