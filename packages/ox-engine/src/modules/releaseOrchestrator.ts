/**
 * ox.release — Release Management & Semantic Versioning Orchestrator.
 * Calculates SemVer releases, compiles release manifests, and orchestrates deployment tags.
 */
export class ReleaseOrchestrator {
  public calculateNextVersion(
    currentVersion: string,
    commits: Array<{ message: string; isBreaking?: boolean }>
  ): { nextVersion: string; bumpType: 'major' | 'minor' | 'patch' | 'none' } {
    const parts = currentVersion.replace(/^v/, '').split('.').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      throw new Error(`Invalid SemVer format: ${currentVersion}`);
    }
    const [major, minor, patch] = parts;

    let hasBreaking = false;
    let hasFeature = false;
    let hasFix = false;

    for (const c of commits) {
      if (c.isBreaking || c.message.includes('BREAKING CHANGE') || c.message.startsWith('feat!')) {
        hasBreaking = true;
        break;
      }
      if (c.message.startsWith('feat:') || c.message.startsWith('feat(')) {
        hasFeature = true;
      }
      if (c.message.startsWith('fix:') || c.message.startsWith('perf:') || c.message.startsWith('fix(')) {
        hasFix = true;
      }
    }

    if (hasBreaking) {
      return { nextVersion: `v${major + 1}.0.0`, bumpType: 'major' };
    }
    if (hasFeature) {
      return { nextVersion: `v${major}.${minor + 1}.0`, bumpType: 'minor' };
    }
    if (hasFix) {
      return { nextVersion: `v${major}.${minor}.${patch + 1}`, bumpType: 'patch' };
    }

    return { nextVersion: `v${major}.${minor}.${patch}`, bumpType: 'none' };
  }

  public generateReleaseManifest(params: {
    version: string;
    commitSha: string;
    evidenceIds: string[];
    dockerImageDigest: string;
    approvedBy: string;
  }): {
    version: string;
    releaseDate: string;
    commitSha: string;
    evidenceIds: string[];
    dockerImageDigest: string;
    approvedBy: string;
    status: 'SEALED';
  } {
    return {
      version: params.version,
      releaseDate: new Date().toISOString(),
      commitSha: params.commitSha,
      evidenceIds: params.evidenceIds,
      dockerImageDigest: params.dockerImageDigest,
      approvedBy: params.approvedBy,
      status: 'SEALED',
    };
  }
}
