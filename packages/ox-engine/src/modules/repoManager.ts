import { RepoDescriptor, RepoSyncStatus } from '../core/types.js';

/**
 * ox.repo — Repository Management & Dual-Push Synchronization Engine.
 * Governs all ecosystem repositories, upstream sync, and drift auditing.
 */
export class RepoManager {
  private readonly registry = new Map<string, RepoDescriptor>();

  constructor() {
    this.registerCanonicalRepositories();
  }

  private registerCanonicalRepositories(): void {
    const repos: RepoDescriptor[] = [
      { name: 'oenexa-platform', category: 'core', upstreamOrigin: 'git@github.com:oenexa/oenexa-platform.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-platform.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-node', category: 'core', upstreamOrigin: 'git@github.com:oenexa/oenexa-node.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-node.git', branch: 'main', runtime: 'go' },
      { name: 'oenexa-exchange', category: 'product', upstreamOrigin: 'git@github.com:oenexa/oenexa-exchange.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-exchange.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-ui', category: 'product', upstreamOrigin: 'git@github.com:oenexa/oenexa-ui.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-ui.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-ai-core', category: 'product', upstreamOrigin: 'git@github.com:oenexa/oenexa-ai-core.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-ai-core.git', branch: 'main', runtime: 'java' },
      { name: 'oenexa-ai-web', category: 'product', upstreamOrigin: 'git@github.com:oenexa/oenexa-ai-web.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-ai-web.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-explorer', category: 'product', upstreamOrigin: 'git@github.com:oenexa/oenexa-explorer.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-explorer.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-contracts', category: 'core', upstreamOrigin: 'git@github.com:oenexa/oenexa-contracts.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-contracts.git', branch: 'main', runtime: 'solidity' },
      { name: 'oenexa-identity', category: 'core', upstreamOrigin: 'git@github.com:oenexa/oenexa-identity.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-identity.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-pay', category: 'product', upstreamOrigin: 'git@github.com:oenexa/oenexa-pay.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-pay.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-devops', category: 'infrastructure', upstreamOrigin: 'git@github.com:oenexa/oenexa-devops.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-devops.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-evidence', category: 'governance', upstreamOrigin: 'git@github.com:oenexa/oenexa-evidence.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-evidence.git', branch: 'main', runtime: 'markdown' },
      { name: 'oenexa-architecture', category: 'governance', upstreamOrigin: 'git@github.com:oenexa/oenexa-architecture.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-architecture.git', branch: 'main', runtime: 'markdown' },
      { name: 'oenexa-database', category: 'core', upstreamOrigin: 'git@github.com:oenexa/oenexa-database.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-database.git', branch: 'main', runtime: 'node' },
      { name: 'oenexa-agents', category: 'product', upstreamOrigin: 'git@github.com:oenexa/oenexa-agents.git', upstreamServer: 'ubuntu@62.210.92.60:/opt/oenexa/repos/oenexa-agents.git', branch: 'main', runtime: 'node' },
    ];

    repos.forEach((r) => this.registry.set(r.name, r));
  }

  public getRepo(name: string): RepoDescriptor | undefined {
    return this.registry.get(name);
  }

  public listRepos(category?: RepoDescriptor['category']): RepoDescriptor[] {
    const all = Array.from(this.registry.values());
    return category ? all.filter((r) => r.category === category) : all;
  }

  public evaluateSyncStatus(
    repoName: string,
    originSha: string,
    serverSha: string,
    isWorkingTreeClean = true
  ): RepoSyncStatus {
    const descriptor = this.registry.get(repoName);
    if (!descriptor) {
      throw new Error(`Repository not found in canonical registry: ${repoName}`);
    }

    const inSync = originSha.trim().length > 0 && originSha === serverSha;

    return {
      repo: repoName,
      originInSync: inSync,
      serverInSync: inSync,
      cleanWorkingTree: isWorkingTreeClean,
      currentCommit: originSha,
      lastChecked: new Date().toISOString(),
    };
  }

  public detectDualPushDrift(statuses: RepoSyncStatus[]): { compliant: boolean; drifted: string[] } {
    const drifted = statuses
      .filter((s) => !s.originInSync || !s.serverInSync || !s.cleanWorkingTree)
      .map((s) => s.repo);

    return {
      compliant: drifted.length === 0,
      drifted,
    };
  }
}
