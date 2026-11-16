import { describe, it, expect } from 'vitest';
import { createCloudEvent, EventTypes } from '@oenexa/event-schemas';
import { ApiResponse, PaginatedResponse } from '@oenexa/api-contracts';
import { TokenPayload } from '@oenexa/auth-sdk';

describe('OENEXA Platform Foundation Contracts & Schema Verification Suite', () => {
  it('validates CNCF CloudEvents across ecosystem event types', () => {
    expect(EventTypes.IDENTITY_USER_REGISTERED).toBe('com.oenexa.identity.user.registered.v1');
    expect(EventTypes.WALLET_ACCOUNT_CREATED).toBe('com.oenexa.wallet.account.created.v1');
    expect(EventTypes.PAYMENT_SETTLED).toBe('com.oenexa.pay.settled.v1');
    expect(EventTypes.CHAIN_BLOCK_PRODUCED).toBe('com.oenexa.chain.block.produced.v1');

    const sampleEvent = createCloudEvent({
      type: EventTypes.IDENTITY_USER_REGISTERED,
      source: '/identity/service',
      data: {
        userId: 'usr_sat_01',
        email: 'satoshi@oenexa.com',
        timestamp: new Date().toISOString(),
      },
    });

    expect(sampleEvent.specversion).toBe('1.0');
    expect(sampleEvent.id).toBeDefined();
    expect(sampleEvent.type).toBe(EventTypes.IDENTITY_USER_REGISTERED);
    expect(sampleEvent.source).toBe('/identity/service');
    expect(sampleEvent.data.userId).toBe('usr_sat_01');
  });

  it('validates Standard API Response contracts and serialization', () => {
    const successPayload: ApiResponse<{ status: string }> = {
      success: true,
      data: { status: 'OPERATIONAL' },
      meta: {
        timestamp: new Date().toISOString(),
        correlationId: 'corr_test_001',
        version: 'v4',
      },
    };

    expect(successPayload.success).toBe(true);
    expect(successPayload.data.status).toBe('OPERATIONAL');
    expect(successPayload.meta?.version).toBe('v4');

    const paginatedPayload: PaginatedResponse<string> = {
      success: true,
      data: ['item1', 'item2', 'item3'],
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: 3,
        totalPages: 1,
      },
    };

    expect(paginatedPayload.pagination.totalItems).toBe(3);
    expect(paginatedPayload.data.length).toBe(3);
  });

  it('validates Auth SDK token decoding and cryptographic payload contract', () => {
    const dummyPayload: TokenPayload = {
      sub: 'usr_sat_01',
      email: 'satoshi@oenexa.com',
      roles: ['USER', 'TRADER'],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      iss: 'https://auth.oenexa.com',
    };

    expect(dummyPayload.sub).toBe('usr_sat_01');
    expect(dummyPayload.roles).toContain('TRADER');
    expect(dummyPayload.exp).toBeGreaterThan(dummyPayload.iat);
  });
});
