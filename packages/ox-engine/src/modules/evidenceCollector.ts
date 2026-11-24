import { createHash } from 'node:crypto';
import { EvidenceRecord, RuntimeEnv } from '../core/types.js';

/**
 * ox.evidence — Cryptographic Evidence Collection & Traceability Engine.
 * Generates RFC 8785 Canonical JSON evidence payloads with immutable SHA-256 digests.
 */
export class EvidenceCollector {
  public canonicalJson(obj: unknown): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return `[${obj.map((item) => this.canonicalJson(item)).join(',')}]`;
    }
    const record = obj as Record<string, unknown>;
    const sortedKeys = Object.keys(record).sort();
    const pairs = sortedKeys.map((key) => `${JSON.stringify(key)}:${this.canonicalJson(record[key])}`);
    return `{${pairs.join(',')}}`;
  }

  public computeDigest(payload: unknown): string {
    const canonical = this.canonicalJson(payload);
    return createHash('sha256').update(canonical, 'utf8').digest('hex');
  }

  public createEvidence(params: {
    evidenceId: string;
    testId: string;
    requirementId: string;
    repository: string;
    environment: RuntimeEnv;
    version: string;
    commitHash: string;
    creator: string;
    reviewer: string;
    approver: string;
    status: 'PASS' | 'FAIL';
    data: Record<string, unknown>;
  }): EvidenceRecord {
    if (params.creator === params.reviewer || params.creator === params.approver || params.reviewer === params.approver) {
      throw new Error('Four-Eyes violation: Creator, Reviewer, and Approver must be distinct for evidence generation.');
    }

    const payloadWithoutDigest = {
      evidence_id: params.evidenceId,
      test_id: params.testId,
      requirement_id: params.requirementId,
      repository: params.repository,
      environment: params.environment,
      version: params.version,
      commit_hash: params.commitHash,
      creator: params.creator,
      reviewer: params.reviewer,
      approver: params.approver,
      execution_time: new Date().toISOString(),
      status: params.status,
      data: params.data,
    };

    const sha256_digest = this.computeDigest(payloadWithoutDigest);

    return {
      ...payloadWithoutDigest,
      sha256_digest,
    };
  }

  public formatMatrixRow(record: EvidenceRecord, specification: string, implementationFile: string): string {
    return `| **${record.requirement_id}** | ${record.repository} | ${specification} | \`${implementationFile}\` | \`${record.commit_hash.slice(0, 7)}\` | \`${record.test_id}\` | \`${record.evidence_id}\` | ${record.reviewer} | ${record.approver} | **${record.status === 'PASS' ? 'APPROVED' : 'REJECTED'}** |`;
  }
}
