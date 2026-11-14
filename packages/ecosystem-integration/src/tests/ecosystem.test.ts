import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { IdentityService } from '@oenexa/identity';
import { WalletService } from '@oenexa/wallet';
import { PaymentService } from '@oenexa/pay';
import { ExchangeService } from '@oenexa/exchange';
import { MarketDataService } from '@oenexa/market-data';
import { AmmLiquidityService } from '@oenexa/liquidity';
import { ValidatorService } from '@oenexa/validator';
import { RagService } from '@oenexa/rag';
import { SwarmService } from '@oenexa/agents';
import { CustomerOrderService } from '@oengo/customer';
import { MerchantService } from '@oengo/merchant';
import { DriverService } from '@oengo/driver';
import { CommerceAdminService } from '@oengo/admin';

describe('OENEXA Master Ecosystem End-to-End Integration Suite', () => {
  it('executes full cross-domain workflow across Identity, FinTech, Chain, AI and Quick-Commerce', async () => {
    // ── 1. Sovereign Identity & Access Management (OIDC PKCE) ─────────────────
    const identityService = new IdentityService();
    const { user, event: userEvent } = identityService.register({
      email: 'satoshi@oenexa.com',
      username: 'satoshi',
      password: 'StrongPassword2026!',
    });
    expect(user.id).toBeDefined();
    expect(userEvent.type).toBe('com.oenexa.identity.user.registered.v1');

    const tokens = identityService.authenticate('satoshi@oenexa.com', 'StrongPassword2026!');
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.tokenType).toBe('Bearer');

    const codeVerifier = 'high_entropy_random_pkce_code_verifier_1234567890';
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    expect(identityService.verifyPkceS256(codeVerifier, codeChallenge)).toBe(true);

    // ── 2. Sovereign Multi-Asset Wallet Custody & Shielded Notes ─────────────
    const walletService = new WalletService();
    const { account } = walletService.createAccount(user.id);
    expect(account.userId).toBe(user.id);

    const { entry: depositEntry } = walletService.recordDeposit({
      accountId: account.id,
      asset: 'ONXC',
      amount: '5000.00',
      txHash: '0xgenesis_deposit_tx_hash',
      confirmations: 12,
    });
    expect(depositEntry.amount).toBe('5000.00');
    expect(depositEntry.type).toBe('CREDIT');

    const shieldedNote = walletService.createShieldedNote({
      accountId: account.id,
      asset: 'ONXC',
      amount: '500.00',
    });
    expect(shieldedNote.spent).toBe(false);
    expect(shieldedNote.commitment).toBeDefined();

    // ── 3. Tri-Rail Payment Gateway (ONXC Native Rail) ──────────────────────
    const payService = new PaymentService();
    const { intent } = payService.createIntent({
      merchantId: 'mch_institutional_01',
      amount: '250.00',
      currency: 'ONXC',
      rail: 'ONXC_NATIVE',
      idempotencyKey: 'idem_key_tx_9981',
    });
    expect(intent.status).toBe('PENDING');

    const { settlement } = payService.settlePayment(intent.id);
    expect(settlement.intentId).toBe(intent.id);
    expect(settlement.rail).toBe('ONXC_NATIVE');
    expect(settlement.settledAt).toBeDefined();

    // ── 4. In-Memory Orderbook Engine & Matching Execution ──────────────────
    const exchange = new ExchangeService();
    // Maker Sell Order: 100 ONXC @ 2.50 USDT
    exchange.placeOrder({
      userId: 'maker_trader_01',
      pair: 'ONXC/USDT',
      side: 'SELL',
      type: 'LIMIT',
      price: 2.50,
      quantity: 100.0,
    });
    // Taker Buy Order (crossing the spread): 50 ONXC @ 2.50 USDT
    const matchResult = exchange.placeOrder({
      userId: user.id,
      pair: 'ONXC/USDT',
      side: 'BUY',
      type: 'LIMIT',
      price: 2.50,
      quantity: 50.0,
    });
    expect(matchResult.trades.length).toBe(1);
    expect(matchResult.trades[0].price).toBe(2.50);
    expect(matchResult.trades[0].quantity).toBe(50.0);

    // ── 5. Market Data Ingestion & Real-Time Ticker Update ──────────────────
    const marketData = new MarketDataService();
    const { ticker } = marketData.ingestTrade({
      pair: 'ONXC/USDT',
      price: matchResult.trades[0].price,
      quantity: matchResult.trades[0].quantity,
      timestamp: Date.now(),
    });
    expect(ticker.lastPrice).toBe(2.50);

    // ── 6. Automated Market Maker (Constant Product x*y=k) ──────────────────
    const amm = new AmmLiquidityService();
    const quote = amm.getQuote('ONXC-USDT', 'ONXC', 100.0);
    expect(quote.expectedOutputAmount).toBeGreaterThan(0);

    const swapResult = amm.swap(
      'ONXC-USDT',
      'ONXC',
      100.0,
      quote.expectedOutputAmount * 0.95 // 5% slippage tolerance
    );
    expect(swapResult.outputAmount).toBe(quote.expectedOutputAmount);

    // ── 7. PoS Consensus & Validator Heartbeat ──────────────────────────────
    const validatorService = new ValidatorService();
    const validator = validatorService.registerValidator({
      moniker: 'validator-frankfurt-01',
      consensusAddress: '0xval_frankfurt_ed25519',
      bondedStake: 25_000_000n * 10n ** 18n,
      commissionRate: 0.05,
    });
    validatorService.recordHeartbeat(validator.id, 516693);
    const activeVal = validatorService.getValidator(validator.id);
    expect(activeVal?.lastBlockHeight).toBe(516693);
    expect(activeVal?.status).toBe('ACTIVE');

    // Test Byzantine Slashing & Outbox Emission
    const slashRecord = validatorService.slash({
      validatorId: validator.id,
      reason: 'DOWNTIME',
      height: 516694,
    });
    expect(slashRecord.slashedAmount).toBeGreaterThan(0n);
    expect(validatorService.getValidator(validator.id)?.status).toBe('SLASHED');

    // ── 8. Cognitive Vector RAG Knowledge Retrieval ────────────────────────
    const rag = new RagService();
    rag.ingestDocument({
      documentId: 'doc_integration_test',
      title: 'Decoupled Domain Sovereignty',
      content: 'Every OENEXA microservice owns its data, APIs, and CloudEvents outbox with zero shared databases.',
    });
    const searchResults = rag.query({
      query: 'sovereignty shared databases outbox',
      topK: 1,
    });
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].chunk.documentId).toBe('doc_integration_test');

    // ── 9. Autonomous Agent Swarm Task Orchestration ────────────────────────
    const swarm = new SwarmService();
    const agent = swarm.registerAgent('security-auditor-01', 'DEVSECOPS');
    const task = swarm.submitTask({
      title: 'Audit Vault dynamic database secrets',
      description: 'Ensure PostgreSQL credentials rotate every 60 minutes',
      requiredRole: 'DEVSECOPS',
    });
    const executedTask = swarm.executeTask(agent.id, task.id);
    expect(executedTask.status).toBe('COMPLETED');
    expect(executedTask.assignedAgentId).toBe(agent.id);

    // ── 10. Quick-Commerce Delivery Pipeline (OENGO Domain) ─────────────────
    const customer = new CustomerOrderService();
    const merchant = new MerchantService();
    const driver = new DriverService();
    const admin = new CommerceAdminService();

    // 10a. Merchant KYB Vetting
    admin.submitKYBApplication('mch_pasticceria_01', 'Pasticceria Milano', 'IT11223344556', 'IT');
    admin.reviewKYBApplication('mch_pasticceria_01', 'APPROVED', 'officer_compliance');

    // 10b. Merchant Store & Menu
    const store = merchant.registerStore({
      name: 'Pasticceria Milano',
      cuisine: 'Italian Bakery',
      address: 'Via Montenapoleone 8, Milano',
      payoutAddress: '0xmerchant_pasticceria_onxc',
    });
    const menuItem = merchant.addMenuItem({
      merchantId: store.id,
      name: 'Panettone Tradizionale 1kg',
      description: 'Handcrafted sourdough panettone with candied citrus',
      price: 24.50,
      category: 'Desserts',
    });

    // 10c. Customer places order
    const order = customer.createOrder({
      customerId: user.id,
      merchantId: store.id,
      items: [{ id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 2 }],
      deliveryAddress: 'Corso Como 10, Milano',
      paymentRail: 'ONXC_NATIVE',
    });
    expect(order.subtotal).toBe(49.00);
    expect(order.total).toBe(51.50); // subtotal + 2.50 delivery fee

    // 10d. Courier dispatches and advances milestones
    driver.registerDriver('drv_mario', 'Mario Rossi', 'SCOOTER', '0xcourier_mario_onxc');
    driver.setAvailability('drv_mario', 'AVAILABLE');
    const mission = driver.acceptMission(
      'msn_panettone_01',
      order.id,
      'drv_mario',
      store.address,
      order.deliveryAddress,
      7.50,
      3.00
    );
    expect(mission.milestone).toBe('ASSIGNED');

    driver.advanceMilestone('msn_panettone_01', 'PICKED_UP');
    const deliveredMission = driver.advanceMilestone('msn_panettone_01', 'DELIVERED');
    expect(deliveredMission.milestone).toBe('DELIVERED');
    expect(driver.getEarnings('drv_mario').totalPayout).toBe(10.50); // 7.50 + 3.00 tip

    // 10e. Customer receives delivery
    customer.updateStatus(order.id, 'DELIVERED');

    // 10f. Regional Commerce Governance & 2% Protocol Fee
    const regionalSummary = admin.recordRegionalOrder('EU-SOUTH', order.total);
    expect(regionalSummary.totalOrders).toBe(1);
    expect(regionalSummary.grossMerchandiseValue).toBe(51.50);
    expect(regionalSummary.platformRevenue).toBe(1.03); // 2% protocol fee

    // ── 11. CloudEvents Outbox Verification across all Boundaries ───────────
    expect(identityService.getOutbox().length).toBeGreaterThan(0);
    expect(walletService.getOutbox().length).toBeGreaterThan(0);
    expect(payService.getOutbox().length).toBeGreaterThan(0);
    expect(exchange.getOutbox().length).toBeGreaterThan(0);
    expect(validatorService.getOutbox().length).toBeGreaterThan(0);
    expect(driver.getOutbox().length).toBeGreaterThan(0);
    expect(admin.getOutbox().length).toBeGreaterThan(0);
  });
});
