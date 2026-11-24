import { SloReport, SyntheticEndpointProbe } from '../core/types.js';

/**
 * ox.mon — Telemetry, Synthetic Probing & SLO Monitoring Engine.
 * Evaluates production endpoint health, latency budgets, and availability SLAs.
 */
export class TelemetryMonitor {
  public static readonly CANONICAL_ENDPOINTS = [
    'https://oenexa.com',
    'https://app.oenexa.com',
    'https://id.oenexa.com',
    'https://api.oenexa.com',
    'https://rpc.oenexa.com',
  ];

  public evaluateProbe(
    endpoint: string,
    statusCode: number,
    latencyMs: number,
    headers?: Record<string, string>
  ): SyntheticEndpointProbe {
    const isHealthy = statusCode >= 200 && statusCode < 400 && latencyMs <= 1500;
    const protocol = 'HTTP/2';
    const tlsVersion = 'TLSv1.3';

    // Verify mandatory banking security headers if provided
    if (headers && !headers['strict-transport-security'] && !headers['Strict-Transport-Security']) {
      // HSTS header required
      return {
        endpoint,
        statusCode,
        latencyMs,
        isHealthy: false,
        protocol,
        tlsVersion,
      };
    }

    return {
      endpoint,
      statusCode,
      latencyMs,
      isHealthy,
      protocol,
      tlsVersion,
    };
  }

  public calculateSlo(probes: SyntheticEndpointProbe[], targetAvailability = 0.9999): SloReport {
    if (probes.length === 0) {
      return {
        targetAvailability,
        actualAvailability: 1.0,
        totalProbes: 0,
        failedProbes: 0,
        status: 'COMPLIANT',
      };
    }

    const failed = probes.filter((p) => !p.isHealthy).length;
    const actualAvailability = (probes.length - failed) / probes.length;

    return {
      targetAvailability,
      actualAvailability,
      totalProbes: probes.length,
      failedProbes: failed,
      status: actualAvailability >= targetAvailability ? 'COMPLIANT' : 'BREACHED',
    };
  }
}
