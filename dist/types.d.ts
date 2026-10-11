export interface SorobanPasskeyCredential {
    credentialId: string;
    publicKeyX: string;
    publicKeyY: string;
    algorithm: 'secp256r1';
    signCount: number;
    createdAt: number;
}
export type SorobanGuardianType = 'INSTITUTIONAL_ANCHOR' | 'BACKUP_DEVICE' | 'TRUSTED_PEER';
export interface SorobanGuardian {
    id: string;
    name: string;
    type: SorobanGuardianType;
    stellarPublicKey: string;
    approved: boolean;
}
export interface SorobanSmartAccount {
    contractId: string;
    stellarAddress: string;
    ownerCredential: SorobanPasskeyCredential;
    guardians: SorobanGuardian[];
    recoveryThreshold: number;
    sequenceNumber: number;
    usdcBalance: number;
    xlmBalance: number;
}
export interface SorobanInvocation {
    contractId: string;
    functionName: string;
    args: unknown[];
    authSignature: string;
    sequenceNumber: number;
    maxFeeXLM: number;
}
export interface SorobanRecoverySession {
    sessionId: string;
    contractId: string;
    proposedCredential: SorobanPasskeyCredential;
    approvals: string[];
    thresholdRequired: number;
    isExecuted: boolean;
    createdAt: number;
}
