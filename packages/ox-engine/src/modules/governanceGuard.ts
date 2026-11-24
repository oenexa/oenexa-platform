import { FourEyesCheck, GovernanceReport, Law7CheckResult } from '../core/types.js';

/**
 * ox.gov — Governance Guard & Constitutional Invariant Enforcer.
 * Evaluates Law 7 (<385 LoC), Four-Eyes Principle, Zero Legacy Presence, and Law 6.
 */
export class GovernanceGuard {
  public static readonly LAW_7_MAX_LINES = 384;
  public static readonly FORBIDDEN_LEGACY_PATTERNS = [
    /\boengo\b/i,
    /oengo-admin/i,
    /oengo-customer/i,
    /oengo-driver/i,
  ];

  public validateFourEyes(creator: string, reviewer: string, approver: string): FourEyesCheck {
    const c = creator.trim().toLowerCase();
    const r = reviewer.trim().toLowerCase();
    const a = approver.trim().toLowerCase();

    if (!c || !r || !a) {
      return {
        creator,
        reviewer,
        approver,
        isValid: false,
        violation: 'Creator, Reviewer, and Approver must all be designated.',
      };
    }

    if (c === r || c === a || r === a) {
      return {
        creator,
        reviewer,
        approver,
        isValid: false,
        violation: 'Four-Eyes Principle violation: Creator, Reviewer, and Approver must all be distinct actors.',
      };
    }

    return {
      creator,
      reviewer,
      approver,
      isValid: true,
    };
  }

  public validateLaw7(files: Array<{ path: string; lines: number }>): Law7CheckResult[] {
    return files.map((f) => {
      const isCompliant = f.lines <= GovernanceGuard.LAW_7_MAX_LINES;
      return {
        file: f.path,
        lineCount: f.lines,
        maxAllowed: GovernanceGuard.LAW_7_MAX_LINES,
        isCompliant,
      };
    });
  }

  public scanZeroLegacyPresence(textSnippets: string[]): { compliant: boolean; violations: string[] } {
    const violations: string[] = [];

    textSnippets.forEach((text, idx) => {
      for (const pattern of GovernanceGuard.FORBIDDEN_LEGACY_PATTERNS) {
        if (pattern.test(text)) {
          violations.push(`Forbidden legacy pattern detected at index ${idx}: matching ${pattern.source}`);
        }
      }
    });

    return {
      compliant: violations.length === 0,
      violations,
    };
  }

  public generateGovernanceReport(
    creator: string,
    reviewer: string,
    approver: string,
    files: Array<{ path: string; lines: number }>,
    contentSnippets: string[],
    testPassRate = 1.0
  ): GovernanceReport {
    const fourEyes = this.validateFourEyes(creator, reviewer, approver);
    const law7Results = this.validateLaw7(files);
    const legacyCheck = this.scanZeroLegacyPresence(contentSnippets);

    const law7Passed = law7Results.every((r) => r.isCompliant);
    const zeroMockPassed = testPassRate >= 1.0;
    const overallPassed = fourEyes.isValid && law7Passed && legacyCheck.compliant && zeroMockPassed;

    return {
      timestamp: new Date().toISOString(),
      fourEyes,
      law7Results,
      zeroMockCompliant: zeroMockPassed,
      zeroLegacyCompliant: legacyCheck.compliant,
      overallStatus: overallPassed ? 'APPROVED' : 'REJECTED',
    };
  }
}
