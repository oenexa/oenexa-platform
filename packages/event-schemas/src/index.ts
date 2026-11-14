/**
 * OENEXA Ecosystem CloudEvents v1.0 Standard Specification
 * Strict conformance to CNCF CloudEvents specification.
 */

export interface CloudEvent<T = Record<string, unknown>> {
  specversion: '1.0';
  id: string;
  source: string;
  type: string;
  time: string;
  datacontenttype: string;
  dataschema?: string;
  subject?: string;
  correlationid?: string;
  causationid?: string;
  data: T;
}

// Domain Event Names
export const EventTypes = {
  // Identity
  IDENTITY_USER_REGISTERED: 'com.oenexa.identity.user.registered.v1',
  IDENTITY_USER_AUTHENTICATED: 'com.oenexa.identity.user.authenticated.v1',
  IDENTITY_SESSION_REVOKED: 'com.oenexa.identity.session.revoked.v1',

  // Wallet
  WALLET_ACCOUNT_CREATED: 'com.oenexa.wallet.account.created.v1',
  WALLET_DEPOSIT_DETECTED: 'com.oenexa.wallet.deposit.detected.v1',
  WALLET_WITHDRAWAL_REQUESTED: 'com.oenexa.wallet.withdrawal.requested.v1',
  WALLET_WITHDRAWAL_SETTLED: 'com.oenexa.wallet.withdrawal.settled.v1',

  // Payment / Pay
  PAYMENT_INTENT_CREATED: 'com.oenexa.pay.intent.created.v1',
  PAYMENT_SETTLED: 'com.oenexa.pay.settled.v1',
  PAYMENT_FAILED: 'com.oenexa.pay.failed.v1',

  // Chain / L1 Node
  CHAIN_BLOCK_PRODUCED: 'com.oenexa.chain.block.produced.v1',
  CHAIN_TX_CONFIRMED: 'com.oenexa.chain.tx.confirmed.v1',
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

// Identity Payloads
export interface UserRegisteredPayload {
  userId: string;
  email: string;
  tier: 'TIER_0' | 'TIER_1' | 'TIER_2' | 'TIER_3';
  createdAt: string;
}

export interface UserAuthenticatedPayload {
  userId: string;
  sessionId: string;
  ipAddress: string;
  mfaVerified: boolean;
}

// Wallet Payloads
export interface WalletDepositDetectedPayload {
  accountId: string;
  asset: string;
  amount: string;
  txHash: string;
  confirmations: number;
}

// Payment Payloads
export interface PaymentSettledPayload {
  paymentId: string;
  merchantId: string;
  amount: string;
  currency: string;
  settledAt: string;
  rail: 'ONXC_NATIVE' | 'SEPA_INSTANT' | 'CARD';
}

/**
 * Factory to create valid CloudEvents v1.0 instances
 */
export function createCloudEvent<T>(params: {
  type: string;
  source: string;
  data: T;
  subject?: string;
  correlationId?: string;
  causationId?: string;
}): CloudEvent<T> {
  return {
    specversion: '1.0',
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    source: params.source,
    type: params.type,
    time: new Date().toISOString(),
    datacontenttype: 'application/json',
    subject: params.subject,
    correlationid: params.correlationId,
    causationid: params.causationId,
    data: params.data,
  };
}
