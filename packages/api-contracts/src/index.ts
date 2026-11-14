/**
 * OENEXA API Standard Contracts
 * RFC 7807 Problem Details, API Response Envelopes & Canonical Headers
 */

export const CanonicalHeaders = {
  CORRELATION_ID: 'x-correlation-id',
  REQUEST_ID: 'x-request-id',
  IDEMPOTENCY_KEY: 'idempotency-key',
  TENANT_ID: 'x-tenant-id',
  API_VERSION: 'x-api-version',
} as const;

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  invalidParams?: Array<{
    name: string;
    reason: string;
  }>;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
    timestamp: string;
    correlationId?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: ProblemDetails;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function createProblemDetails(params: {
  status: number;
  title: string;
  detail: string;
  type?: string;
  instance?: string;
  invalidParams?: Array<{ name: string; reason: string }>;
}): ProblemDetails {
  return {
    type: params.type || `https://api.oenexa.com/errors/http-${params.status}`,
    title: params.title,
    status: params.status,
    detail: params.detail,
    instance: params.instance,
    invalidParams: params.invalidParams,
  };
}

export function createSuccessResponse<T>(
  data: T,
  meta?: Omit<NonNullable<ApiSuccessResponse<T>['meta']>, 'timestamp'>
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
    },
  };
}
