#!/usr/bin/env node
import { oxEngine, OxEngine } from './engine.js';

/**
 * OX Engine CLI — Command-line interface for OENEXAHUB Engineering Operating System.
 */
export async function runCli(args: string[]): Promise<number> {
  const command = args[0] || 'status';

  switch (command) {
    case '--version':
    case '-v':
      console.log(`OX Engine v${OxEngine.VERSION} (OENEXAHUB Engineering OS)`);
      return 0;

    case 'status':
    case 'health': {
      const health = oxEngine.getSystemHealth();
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`OX ENGINE STATUS: ${health.status}`);
      console.log(`Version:             v${health.version}`);
      console.log(`Managed Repos:       ${health.totalManagedRepos}`);
      console.log(`Autonomous Agents:   ${health.activeAgents}`);
      console.log(`Governance State:    ${health.governanceCompliance ? 'COMPLIANT' : 'NON-COMPLIANT'}`);
      console.log(`Timestamp:           ${health.timestamp}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return 0;
    }

    case 'repos': {
      const repos = oxEngine.repo.listRepos();
      console.log(`Total Managed Repositories: ${repos.length}`);
      repos.forEach((r) => {
        console.log(` • [${r.category.toUpperCase()}] ${r.name} (${r.runtime}) -> ${r.branch}`);
      });
      return 0;
    }

    case 'agents': {
      const agents = oxEngine.agent.listAgents();
      console.log(`Active Autonomous Swarm Agents: ${agents.length}`);
      agents.forEach((a) => {
        console.log(` • ${a.agentId}: ${a.role} [${a.status}]`);
      });
      return 0;
    }

    default:
      console.error(`Unknown OX Engine command: ${command}`);
      console.log('Usage: ox [status|health|repos|agents|--version]');
      return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('cli.js')) {
  runCli(process.argv.slice(2)).then((code) => process.exit(code));
}
