import { describe, it, expect } from 'vitest';
import {
  CanonicalHeaders,
  createProblemDetails,
  createSuccessResponse,
} from './index';

describe('API Contracts & RFC 7807', () => {
  it('formats RFC 7807 problem details correctly', () => {
    const error = createProblemDetails({
      status: 400,
      title: 'Bad Request',
      detail: 'The requested withdrawal amount exceeds your daily limit.',
      instance: '/v1/wallet/withdrawals',
      invalidParams: [
        { name: 'amount', reason: 'exceeds maximum allowed 10000 ONXC' },
      ],
    });

    expect(error.status).toBe(400);
    expect(error.type).toBe('https://api.oenexa.com/errors/http-400');
    expect(error.title).toBe('Bad Request');
    expect(error.detail).toContain('exceeds your daily limit');
    expect(error.invalidParams).toHaveLength(1);
    expect(error.invalidParams?.[0].name).toBe('amount');
  });

  it('formats standardized API success envelope', () => {
    const resp = createSuccessResponse({ orderId: 'ord_1234' }, { total: 1 });
    expect(resp.success).toBe(true);
    expect(resp.data.orderId).toBe('ord_1234');
    expect(resp.meta?.total).toBe(1);
    expect(resp.meta?.timestamp).toBeDefined();
  });

  it('exposes canonical correlation and idempotency headers', () => {
    expect(CanonicalHeaders.CORRELATION_ID).toBe('x-correlation-id');
    expect(CanonicalHeaders.IDEMPOTENCY_KEY).toBe('idempotency-key');
  });
});
