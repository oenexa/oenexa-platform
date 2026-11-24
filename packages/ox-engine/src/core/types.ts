/**
 * OX Engine Core Domain Types & Protocols.
 * Standardized contracts for the OENEXAHUB Engineering Operating System.
 */

export type RuntimeEnv = 'development' | 'staging' | 'production';

export interface RepoDescriptor {
  name: string;
  category: 'core' | 'product' | 'governance' | 'infrastructure';
  upstreamOrigin: string;
  upstreamServer: string;
  branch: string;
  runtime: 'node' | 'go' | 'solidity' | 'java' | 'python' | 'markdown';
}

export interface RepoSyncStatus {
  repo: string;
  originInSync: boolean;
  serverInSync: boolean;
  cleanWorkingTree: boolean;
  currentCommit: string;
  lastChecked: string;
}

export type GateName =
  | 'style_lint'
  | 'typecheck'
  | 'zero_mock_tests'
  | 'security_audit'
  | 'production_build'
  | 'container_verify'
  | 'governance_attest';

export type GateStatus = 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED';

export interface PipelineGate {
  name: GateName;
  status: GateStatus;
  durationMs: number;
  output?: string;
  error?: string;
}

export interface PipelineResult {
  pipelineId: string;
  repo: string;
  overallStatus: 'PASSED' | 'FAILED';
  totalDurationMs: number;
  gates: PipelineGate[];
  timestamp: string;
}

export interface FourEyesCheck {
  creator: string;
  reviewer: string;
  approver: string;
  isValid: boolean;
  violation?: string;
}

export interface Law7CheckResult {
  file: string;
  lineCount: number;
  maxAllowed: number;
  isCompliant: boolean;
}

export interface GovernanceReport {
  timestamp: string;
  fourEyes: FourEyesCheck;
  law7Results: Law7CheckResult[];
  zeroMockCompliant: boolean;
  zeroLegacyCompliant: boolean;
  overallStatus: 'APPROVED' | 'REJECTED';
}

export interface EvidenceRecord {
  evidence_id: string;
  test_id: string;
  requirement_id: string;
  repository: string;
  environment: RuntimeEnv;
  version: string;
  commit_hash: string;
  creator: string;
  reviewer: string;
  approver: string;
  execution_time: string;
  status: 'PASS' | 'FAIL';
  sha256_digest: string;
  data: Record<string, unknown>;
}

export interface SyntheticEndpointProbe {
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  isHealthy: boolean;
  protocol: 'HTTP/2' | 'HTTP/1.1';
  tlsVersion: string;
}

export interface SloReport {
  targetAvailability: number;
  actualAvailability: number;
  totalProbes: number;
  failedProbes: number;
  status: 'COMPLIANT' | 'BREACHED';
}

export interface AgentDescriptor {
  agentId: string;
  role: string;
  capabilities: string[];
  status: 'IDLE' | 'BUSY' | 'TERMINATED';
}

export interface AgentTask {
  taskId: string;
  assignedAgent: string;
  action: string;
  payload: Record<string, unknown>;
  createdAt: string;
}
