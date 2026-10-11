// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SorobanPasskeyAuth,
  SorobanSmartAccountManager
} from '../dist/index.js';

test('1. SorobanPasskeyAuth generates hardware-bound secp256r1 credential', () => {
  const cred = SorobanPasskeyAuth.createCredential();

  assert.ok(cred.credentialId.startsWith('soroban_passkey_'));
  assert.equal(cred.algorithm, 'secp256r1');
  assert.ok(cred.publicKeyX.startsWith('0x') && cred.publicKeyX.length === 66);
  assert.ok(cred.publicKeyY.startsWith('0x') && cred.publicKeyY.length === 66);
});

test('2. SorobanSmartAccountManager initializes with contract address and guardians', () => {
  const cred = SorobanPasskeyAuth.createCredential();
  const manager = new SorobanSmartAccountManager(cred);
  const account = manager.getAccount();

  assert.ok(account.contractId.startsWith('CA71BB'));
  assert.ok(account.stellarAddress.startsWith('GA71BB'));
  assert.equal(account.recoveryThreshold, 2);
  assert.equal(account.guardians.length, 3);
  assert.equal(account.usdcBalance, 15_000);
});

test('3. buildInvocation constructs signed Soroban call and increments sequence', () => {
  const cred = SorobanPasskeyAuth.createCredential();
  const manager = new SorobanSmartAccountManager(cred);

  const invocation = manager.buildInvocation('C_DEX_CONTRACT_123', 'swap', [100, 200]);
  assert.equal(invocation.contractId, 'C_DEX_CONTRACT_123');
  assert.equal(invocation.functionName, 'swap');
  assert.equal(invocation.sequenceNumber, 1);
  assert.ok(invocation.authSignature.startsWith('0x_p256_soroban_sig_'));
  assert.equal(manager.getAccount().sequenceNumber, 2);
});

test('4. buildUsdcTransfer builds authorized Stellar USDC transfer invocation', () => {
  const cred = SorobanPasskeyAuth.createCredential();
  const manager = new SorobanSmartAccountManager(cred);

  const transfer = manager.buildUsdcTransfer('GB2BHZX2SGCNNQVNC3CWSEHGWWJFIARVLDRAHED4IACUKRI5UCWZRN5R', 500);
  assert.equal(transfer.functionName, 'transfer');
  assert.equal(transfer.args[1], 'GB2BHZX2SGCNNQVNC3CWSEHGWWJFIARVLDRAHED4IACUKRI5UCWZRN5R');
  assert.equal(transfer.args[2], 500 * 1e7); // Stellar 7 decimals
});

test('5. buildUsdcTransfer throws on insufficient balance', () => {
  const cred = SorobanPasskeyAuth.createCredential();
  const manager = new SorobanSmartAccountManager(cred);

  assert.throws(() => {
    manager.buildUsdcTransfer('GB2BHZX2SGCNNQVNC3CWSEHGWWJFIARVLDRAHED4IACUKRI5UCWZRN5R', 50_000);
  }, /Insufficient USDC/);
});

test('6. 2-of-3 Guardian threshold recovery rotates passkey on Soroban account', () => {
  const oldCred = SorobanPasskeyAuth.createCredential();
  const manager = new SorobanSmartAccountManager(oldCred);
  const newCred = SorobanPasskeyAuth.createCredential('Replacement Passkey');

  const session = manager.initiateRecovery(newCred);
  assert.equal(session.thresholdRequired, 2);
  assert.equal(session.approvals.length, 0);

  // Guardian 1 (Stellar Anchor) approves
  manager.approveRecovery('g_stellar_anchor');
  // Guardian 2 (Backup Hardware) approves
  manager.approveRecovery('g_backup_hardware');

  // Execute recovery
  const success = manager.executeRecovery();
  assert.equal(success, true);
  assert.equal(manager.getAccount().ownerCredential.credentialId, newCred.credentialId);
});

test('7. Recovery rejects execution if threshold is not reached', () => {
  const oldCred = SorobanPasskeyAuth.createCredential();
  const manager = new SorobanSmartAccountManager(oldCred);
  const newCred = SorobanPasskeyAuth.createCredential('Unauthorized Attempt');

  manager.initiateRecovery(newCred);
  manager.approveRecovery('g_stellar_anchor'); // Only 1 approval

  assert.throws(() => {
    manager.executeRecovery();
  }, /Threshold not reached/);
});
