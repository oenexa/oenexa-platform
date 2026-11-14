import { describe, it, expect } from 'vitest';
import { createCloudEvent, EventTypes, type UserRegisteredPayload } from './index';

describe('Event Schemas & CloudEvents Factory', () => {
  it('creates valid CloudEvents v1.0 standard envelope', () => {
    const payload: UserRegisteredPayload = {
      userId: 'usr_109283',
      email: 'investor@oenexa.com',
      tier: 'TIER_2',
      createdAt: new Date().toISOString(),
    };

    const event = createCloudEvent({
      type: EventTypes.IDENTITY_USER_REGISTERED,
      source: 'https://id.oenexa.com/auth',
      data: payload,
      subject: 'usr_109283',
      correlationId: 'corr_9981',
    });

    expect(event.specversion).toBe('1.0');
    expect(event.type).toBe('com.oenexa.identity.user.registered.v1');
    expect(event.source).toBe('https://id.oenexa.com/auth');
    expect(event.id.startsWith('evt_')).toBe(true);
    expect(event.datacontenttype).toBe('application/json');
    expect(event.subject).toBe('usr_109283');
    expect(event.correlationid).toBe('corr_9981');
    expect(event.data.email).toBe('investor@oenexa.com');
  });
});
