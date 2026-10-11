// SPDX-License-Identifier: MIT
import {
  SorobanSmartAccount,
  SorobanPasskeyCredential,
  SorobanGuardian,
  SorobanInvocation,
  SorobanRecoverySession
} from '../types.js';

export class SorobanSmartAccountManager {
  private account: SorobanSmartAccount;
  private activeRecovery: SorobanRecoverySession | null = null;

  constructor(ownerCredential: SorobanPasskeyCredential) {
    const defaultGuardians: SorobanGuardian[] = [
      {
        id: 'g_stellar_anchor',
        name: 'Regulated Stellar Anchor / Bank Guardian',
        type: 'INSTITUTIONAL_ANCHOR',
        stellarPublicKey: 'GB2BHZX2SGCNNQVNC3CWSEHGWWJFIARVLDRAHED4IACUKRI5UCWZRN5R',
        approved: true
      },
      {
        id: 'g_backup_hardware',
        name: 'Client Backup Hardware Key / iPad',
        type: 'BACKUP_DEVICE',
        stellarPublicKey: 'GDFH726354819434E9DCA9530C14F1959945FF2209DFA522650089D3422',
        approved: true
      },
      {
        id: 'g_recovery_signer',
        name: 'Trusted Attorney / Emergency Key',
        type: 'TRUSTED_PEER',
        stellarPublicKey: 'GC71BB39189434E9DCA9530C14F1959945FF0X2209DFA522650089D3422',
        approved: true
      }
    ];

    const contractHash = Array.from(ownerCredential.credentialId)
      .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
      .toString(16)
      .padStart(8, '0');

    this.account = {
      contractId: `CA71BB${contractHash.toUpperCase()}9434E9DCA9530C14F1959945FF`,
      stellarAddress: `GA71BB${contractHash.toUpperCase()}9434E9DCA9530C14F1959945FF`,
      ownerCredential,
      guardians: defaultGuardians,
      recoveryThreshold: 2, // 2-of-3 threshold
      sequenceNumber: 1,
      usdcBalance: 15_000.0, // $15,000 Stellar USDC
      xlmBalance: 250.0      // 250 native XLM
    };
  }

  public getAccount(): SorobanSmartAccount {
    return { ...this.account };
  }

  /**
   * Builds an authorized Soroban contract invocation signed by the WebAuthn passkey.
   */
  public buildInvocation(
    contractId: string,
    functionName: string,
    args: unknown[],
    maxFeeXLM = 0.001
  ): SorobanInvocation {
    const seq = this.account.sequenceNumber++;
    return {
      contractId,
      functionName,
      args,
      authSignature: `0x_p256_soroban_sig_${this.account.ownerCredential.credentialId}_${seq}`,
      sequenceNumber: seq,
      maxFeeXLM
    };
  }

  /**
   * Transfers Stellar USDC from the Soroban smart account.
   */
  public buildUsdcTransfer(recipientAddress: string, amountUSDC: number): SorobanInvocation {
    if (amountUSDC > this.account.usdcBalance) {
      throw new Error(`Insufficient USDC: requested ${amountUSDC}, available ${this.account.usdcBalance}`);
    }

    return this.buildInvocation(
      'CC4W5N4T5...USDC_SOROBAN_TOKEN_CONTRACT',
      'transfer',
      [this.account.contractId, recipientAddress, Math.floor(amountUSDC * 1e7)]
    );
  }

  /**
   * Initiates a 2-of-3 Guardian threshold recovery session.
   */
  public initiateRecovery(newCredential: SorobanPasskeyCredential): SorobanRecoverySession {
    this.activeRecovery = {
      sessionId: `soroban_recov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      contractId: this.account.contractId,
      proposedCredential: newCredential,
      approvals: [],
      thresholdRequired: this.account.recoveryThreshold,
      isExecuted: false,
      createdAt: Date.now()
    };
    return { ...this.activeRecovery };
  }

  /**
   * Approves recovery with guardian signature.
   */
  public approveRecovery(guardianId: string): SorobanRecoverySession {
    if (!this.activeRecovery || this.activeRecovery.isExecuted) {
      throw new Error('No active recovery session');
    }

    const guardian = this.account.guardians.find(g => g.id === guardianId && g.approved);
    if (!guardian) {
      throw new Error(`Invalid guardian: ${guardianId}`);
    }

    if (!this.activeRecovery.approvals.includes(guardianId)) {
      this.activeRecovery.approvals.push(guardianId);
    }

    return { ...this.activeRecovery };
  }

  /**
   * Executes recovery when threshold (2 of 3) is reached.
   */
  public executeRecovery(): boolean {
    if (!this.activeRecovery) {
      throw new Error('No active recovery session');
    }

    if (this.activeRecovery.approvals.length < this.activeRecovery.thresholdRequired) {
      throw new Error(`Threshold not reached: ${this.activeRecovery.approvals.length} of ${this.activeRecovery.thresholdRequired}`);
    }

    this.account.ownerCredential = this.activeRecovery.proposedCredential;
    this.activeRecovery.isExecuted = true;
    return true;
  }
}
