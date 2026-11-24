import { describe, it, expect } from 'vitest';
import {
  OxEngine,
  RepoManager,
  PipelineEngine,
  GovernanceGuard,
  ComplianceAudit,
  EvidenceCollector,
  AgentDispatcher,
  TelemetryMonitor,
  ReleaseOrchestrator,
} from '../index.js';

describe('OX Engine & OENEXAHUB Zero-Mock Engineering OS Suite', () => {
  it('RepoManager: lists canonical polyrepo registry and audits dual-push drift', () => {
    const mgr = new RepoManager();
    const repos = mgr.listRepos();
    expect(repos.length).toBeGreaterThanOrEqual(15);
    expect(mgr.getRepo('oenexa-platform')).toBeDefined();
    expect(mgr.getRepo('oenexa-node')?.runtime).toBe('go');

    const inSync = mgr.evaluateSyncStatus('oenexa-ui', 'abc1234', 'abc1234', true);
    expect(inSync.originInSync).toBe(true);
    expect(inSync.serverInSync).toBe(true);

    const drifted = mgr.evaluateSyncStatus('oenexa-exchange', 'abc1234', 'diff5678', true);
    expect(drifted.originInSync).toBe(false);

    const driftAudit = mgr.detectDualPushDrift([inSync, drifted]);
    expect(driftAudit.compliant).toBe(false);
    expect(driftAudit.drifted).toContain('oenexa-exchange');
  });

  it('PipelineEngine: executes 7-gate enterprise CI/CD verification pipeline', async () => {
    const pipeline = new PipelineEngine();
    const res = await pipeline.runPipeline('oenexa-core');

    expect(res.overallStatus).toBe('PASSED');
    expect(res.gates.length).toBe(7);
    expect(res.gates.map((g) => g.name)).toEqual([
      'style_lint',
      'typecheck',
      'zero_mock_tests',
      'security_audit',
      'production_build',
      'container_verify',
      'governance_attest',
    ]);
  });

  it('PipelineEngine: halts on gate failure', async () => {
    const pipeline = new PipelineEngine();
    const res = await pipeline.runPipeline('oenexa-pay', {
      typecheck: async () => ({ success: false, error: 'Type error: TS2322' }),
    });

    expect(res.overallStatus).toBe('FAILED');
    expect(res.gates.length).toBe(2);
    expect(res.gates[1].name).toBe('typecheck');
    expect(res.gates[1].status).toBe('FAILED');
  });

  it('GovernanceGuard: strictly validates Four-Eyes and Law 7 line ceilings', () => {
    const gov = new GovernanceGuard();

    // Four-Eyes
    const validFourEyes = gov.validateFourEyes('alice', 'bob', 'carol');
    expect(validFourEyes.isValid).toBe(true);

    const invalidFourEyes = gov.validateFourEyes('alice', 'alice', 'carol');
    expect(invalidFourEyes.isValid).toBe(false);

    // Law 7 line limits (< 385 lines)
    const law7Check = gov.validateLaw7([
      { path: 'src/engine.ts', lines: 65 },
      { path: 'src/oversized.ts', lines: 450 },
    ]);
    expect(law7Check[0].isCompliant).toBe(true);
    expect(law7Check[1].isCompliant).toBe(false);

    // Zero legacy presence
    const legacyCheck = gov.scanZeroLegacyPresence([
      'Clean oenexa code',
      'legacy oengo package found',
    ]);
    expect(legacyCheck.compliant).toBe(false);
    expect(legacyCheck.violations.length).toBe(1);
  });

  it('ComplianceAudit: validates ISO 20022 and FATF IVMS 101 payloads', () => {
    const comp = new ComplianceAudit();

    // ISO 20022 pain.001
    const painValid = comp.validateIso20022Pain001({
      messageId: 'MSG-001',
      initiatingParty: 'Oenexa Treasury',
      debtorIban: 'FR7630006000011234567890189',
      creditorIban: 'DE89370400440532013000',
      amount: 50000,
      currency: 'EUR',
    });
    expect(painValid.valid).toBe(true);

    // FATF IVMS 101
    const fatfValid = comp.validateFatfIvms101({
      originator: { name: 'Alice Trader', accountNumber: 'ACC-01' },
      beneficiary: { name: 'Bob Counterparty', accountNumber: 'ACC-02' },
      originatorVasp: 'LEI-12345-OENEXA',
      beneficiaryVasp: 'LEI-67890-KRAKEN',
    });
    expect(fatfValid.valid).toBe(true);

    // MiCA Disclosures
    const mica = comp.evaluateMicaDisclosures({
      whitepaperPublished: true,
      reserveAssetProofAvailable: true,
      redemptionRightGuaranteed: true,
      liquidityBufferRatio: 0.35,
    });
    expect(mica.compliant).toBe(true);
    expect(mica.score).toBe(100);
  });

  it('EvidenceCollector: generates RFC 8785 Canonical JSON and SHA-256 digest', () => {
    const collector = new EvidenceCollector();
    const digest1 = collector.computeDigest({ b: 2, a: 1 });
    const digest2 = collector.computeDigest({ a: 1, b: 2 });
    expect(digest1).toBe(digest2); // Order independence (RFC 8785)

    const evidence = collector.createEvidence({
      evidenceId: 'EV-OX-001',
      testId: 'TC-OX-001',
      requirementId: 'REQ-PLAT-01',
      repository: 'oenexa-platform',
      environment: 'production',
      version: 'v1.0.0',
      commitHash: '37e43f7',
      creator: 'ox-agent',
      reviewer: 'qa-lead',
      approver: 'chief-architect',
      status: 'PASS',
      data: { score: 100 },
    });

    expect(evidence.sha256_digest).toHaveLength(64);
    const row = collector.formatMatrixRow(evidence, 'Unified Engineering OS', 'engine.ts');
    expect(row).toContain('REQ-PLAT-01');
    expect(row).toContain('EV-OX-001');
  });

  it('AgentDispatcher: coordinates autonomous swarm agents and task logging', async () => {
    const dispatcher = new AgentDispatcher();
    const agents = dispatcher.listAgents();
    expect(agents.length).toBeGreaterThanOrEqual(4);
    expect(dispatcher.getAgent('ox-agent')?.role).toBe('Autonomous Principal Engineer');

    const result = await dispatcher.dispatchTask('ox-agent', 'health_check', { scope: 'full' });
    expect(result.status).toBe('COMPLETED');
    expect(dispatcher.getTaskHistory().length).toBe(1);
  });

  it('TelemetryMonitor: calculates SLO availability and synthetic health', () => {
    const mon = new TelemetryMonitor();
    const probe = mon.evaluateProbe('https://oenexa.com', 200, 45, {
      'strict-transport-security': 'max-age=31536000',
    });
    expect(probe.isHealthy).toBe(true);

    const slo = mon.calculateSlo([probe, probe, probe], 0.9999);
    expect(slo.status).toBe('COMPLIANT');
    expect(slo.actualAvailability).toBe(1.0);
  });

  it('ReleaseOrchestrator: calculates SemVer bumps and seals release manifests', () => {
    const rel = new ReleaseOrchestrator();

    const patch = rel.calculateNextVersion('v1.0.0', [{ message: 'fix: resolve race condition' }]);
    expect(patch.nextVersion).toBe('v1.0.1');

    const minor = rel.calculateNextVersion('v1.0.0', [{ message: 'feat: add ox engine' }]);
    expect(minor.nextVersion).toBe('v1.1.0');

    const major = rel.calculateNextVersion('v1.0.0', [{ message: 'feat!: breaking change' }]);
    expect(major.nextVersion).toBe('v2.0.0');

    const manifest = rel.generateReleaseManifest({
      version: 'v1.1.0',
      commitSha: '37e43f7',
      evidenceIds: ['EV-OX-001'],
      dockerImageDigest: 'sha256:e0abaf4e',
      approvedBy: 'Chief Architect',
    });
    expect(manifest.status).toBe('SEALED');
  });

  it('OxEngine: unified singleton reports complete system health', () => {
    const engine = new OxEngine();
    const health = engine.getSystemHealth();
    expect(health.status).toBe('OPERATIONAL');
    expect(health.totalManagedRepos).toBeGreaterThanOrEqual(15);
    expect(health.activeAgents).toBeGreaterThanOrEqual(4);
    expect(health.governanceCompliance).toBe(true);
  });
});
