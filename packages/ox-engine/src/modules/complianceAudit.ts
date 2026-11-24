/**
 * ox.comp — FinTech & Regulatory Compliance Engine.
 * Validates ISO 20022 messages, FATF IVMS 101 records, and MiCA regulatory mandates.
 */
export class ComplianceAudit {
  public validateIso20022Pain001(msg: Record<string, unknown>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!msg.messageId || typeof msg.messageId !== 'string') errors.push('Missing messageId');
    if (!msg.initiatingParty || typeof msg.initiatingParty !== 'string') errors.push('Missing initiatingParty');
    if (!msg.debtorIban || typeof msg.debtorIban !== 'string') errors.push('Missing debtorIban');
    if (!msg.creditorIban || typeof msg.creditorIban !== 'string') errors.push('Missing creditorIban');
    if (typeof msg.amount !== 'number' || msg.amount <= 0) errors.push('Invalid amount');
    if (!msg.currency || typeof msg.currency !== 'string') errors.push('Missing currency');

    return { valid: errors.length === 0, errors };
  }

  public validateIso20022Camt053(msg: Record<string, unknown>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!msg.statementId || typeof msg.statementId !== 'string') errors.push('Missing statementId');
    if (!msg.accountIban || typeof msg.accountIban !== 'string') errors.push('Missing accountIban');
    if (typeof msg.openingBalance !== 'number') errors.push('Missing openingBalance');
    if (typeof msg.closingBalance !== 'number') errors.push('Missing closingBalance');
    if (!Array.isArray(msg.entries)) errors.push('Missing or invalid entries array');

    return { valid: errors.length === 0, errors };
  }

  public validateFatfIvms101(payload: Record<string, unknown>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const originator = payload.originator as Record<string, unknown> | undefined;
    const beneficiary = payload.beneficiary as Record<string, unknown> | undefined;

    if (!originator || !originator.name || !originator.accountNumber) {
      errors.push('FATF IVMS 101: Incomplete Originator details (name and accountNumber required)');
    }
    if (!beneficiary || !beneficiary.name || !beneficiary.accountNumber) {
      errors.push('FATF IVMS 101: Incomplete Beneficiary details (name and accountNumber required)');
    }
    if (!payload.originatorVasp || typeof payload.originatorVasp !== 'string') {
      errors.push('FATF IVMS 101: Missing Originator VASP identifier / LEI');
    }
    if (!payload.beneficiaryVasp || typeof payload.beneficiaryVasp !== 'string') {
      errors.push('FATF IVMS 101: Missing Beneficiary VASP identifier / LEI');
    }

    return { valid: errors.length === 0, errors };
  }

  public evaluateMicaDisclosures(disclosure: {
    whitepaperPublished: boolean;
    reserveAssetProofAvailable: boolean;
    redemptionRightGuaranteed: boolean;
    liquidityBufferRatio: number;
  }): { compliant: boolean; score: number; findings: string[] } {
    const findings: string[] = [];
    let score = 0;

    if (disclosure.whitepaperPublished) score += 25;
    else findings.push('MiCA Art 6: Crypto-asset white paper must be published and notified.');

    if (disclosure.reserveAssetProofAvailable) score += 25;
    else findings.push('MiCA Art 36: Reserve of assets must be segregated and independently provable.');

    if (disclosure.redemptionRightGuaranteed) score += 25;
    else findings.push('MiCA Art 39: Permanent redemption right at par value must be granted.');

    if (disclosure.liquidityBufferRatio >= 0.3) score += 25;
    else findings.push('MiCA Art 38: Liquidity buffer ratio below 30% prudential threshold.');

    return {
      compliant: findings.length === 0,
      score,
      findings,
    };
  }
}
