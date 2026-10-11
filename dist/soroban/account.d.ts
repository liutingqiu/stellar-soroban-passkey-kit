import { SorobanSmartAccount, SorobanPasskeyCredential, SorobanInvocation, SorobanRecoverySession } from '../types.js';
export declare class SorobanSmartAccountManager {
    private account;
    private activeRecovery;
    constructor(ownerCredential: SorobanPasskeyCredential);
    getAccount(): SorobanSmartAccount;
    /**
     * Builds an authorized Soroban contract invocation signed by the WebAuthn passkey.
     */
    buildInvocation(contractId: string, functionName: string, args: unknown[], maxFeeXLM?: number): SorobanInvocation;
    /**
     * Transfers Stellar USDC from the Soroban smart account.
     */
    buildUsdcTransfer(recipientAddress: string, amountUSDC: number): SorobanInvocation;
    /**
     * Initiates a 2-of-3 Guardian threshold recovery session.
     */
    initiateRecovery(newCredential: SorobanPasskeyCredential): SorobanRecoverySession;
    /**
     * Approves recovery with guardian signature.
     */
    approveRecovery(guardianId: string): SorobanRecoverySession;
    /**
     * Executes recovery when threshold (2 of 3) is reached.
     */
    executeRecovery(): boolean;
}
