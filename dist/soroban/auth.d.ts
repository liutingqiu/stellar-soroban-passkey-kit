import { SorobanPasskeyCredential } from '../types.js';
export declare class SorobanPasskeyAuth {
    /**
     * Generates a new hardware-bound WebAuthn P-256 credential for Soroban.
     */
    static createCredential(label?: string): SorobanPasskeyCredential;
    /**
     * Simulates Soroban native secp256r1 curve signature verification.
     * In Soroban smart contracts, verified via `env.crypto().secp256r1_verify(msg, sig, pubkey)`.
     */
    static verifySorobanSignature(credential: SorobanPasskeyCredential, messageDigestHex: string, signatureHex: string): boolean;
}
