import { RepoManager } from './modules/repoManager.js';
import { PipelineEngine } from './modules/pipelineEngine.js';
import { GovernanceGuard } from './modules/governanceGuard.js';
import { ComplianceAudit } from './modules/complianceAudit.js';
import { EvidenceCollector } from './modules/evidenceCollector.js';
import { AgentDispatcher } from './modules/agentDispatcher.js';
import { TelemetryMonitor } from './modules/telemetryMonitor.js';
import { ReleaseOrchestrator } from './modules/releaseOrchestrator.js';

export interface OxSystemHealthSummary {
  version: string;
  timestamp: string;
  status: 'OPERATIONAL' | 'DEGRADED';
  totalManagedRepos: number;
  activeAgents: number;
  governanceCompliance: boolean;
}

/**
 * OX Engine — Autonomous Engineering Operating System for OENEXAHUB.
 * Provides unified repository management, CI/CD, governance, evidence, and release control.
 */
export class OxEngine {
  public static readonly VERSION = '1.0.0';

  public readonly repo: RepoManager;
  public readonly cicd: PipelineEngine;
  public readonly gov: GovernanceGuard;
  public readonly comp: ComplianceAudit;
  public readonly evidence: EvidenceCollector;
  public readonly agent: AgentDispatcher;
  public readonly mon: TelemetryMonitor;
  public readonly release: ReleaseOrchestrator;

  constructor() {
    this.repo = new RepoManager();
    this.cicd = new PipelineEngine();
    this.gov = new GovernanceGuard();
    this.comp = new ComplianceAudit();
    this.evidence = new EvidenceCollector();
    this.agent = new AgentDispatcher();
    this.mon = new TelemetryMonitor();
    this.release = new ReleaseOrchestrator();
  }

  public getSystemHealth(): OxSystemHealthSummary {
    const repos = this.repo.listRepos();
    const agents = this.agent.listAgents();

    return {
      version: OxEngine.VERSION,
      timestamp: new Date().toISOString(),
      status: 'OPERATIONAL',
      totalManagedRepos: repos.length,
      activeAgents: agents.length,
      governanceCompliance: true,
    };
  }
}

export const oxEngine = new OxEngine();
