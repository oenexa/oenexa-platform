export type OenexaProductId =
  | 'portal'
  | 'exchange'
  | 'wallet'
  | 'pay'
  | 'chain'
  | 'ai'
  | 'oengo'
  | 'security'
  | 'admin'
  | 'docs';

export interface OenexaNavigationItem {
  id: OenexaProductId;
  label: string;
  path: string;
  canonicalUrl: string;
  description: string;
}

export const CANONICAL_ECOSYSTEM_NAV: OenexaNavigationItem[] = [
  {
    id: 'portal',
    label: 'Overview',
    path: '/dashboard',
    canonicalUrl: 'https://app.oenexa.com/dashboard',
    description: 'Unified Portfolio, Balances & Quick Actions',
  },
  {
    id: 'exchange',
    label: 'Exchange',
    path: '/exchange',
    canonicalUrl: 'https://app.oenexa.com/exchange',
    description: 'Spot & Institutional Order Book Trading',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    path: '/wallet',
    canonicalUrl: 'https://app.oenexa.com/wallet',
    description: 'Multi-Asset Custody & Quantum Shielded Notes',
  },
  {
    id: 'pay',
    label: 'Pay',
    path: '/pay',
    canonicalUrl: 'https://app.oenexa.com/pay',
    description: 'Tri-Rail Merchant Settlement & Checkout',
  },
  {
    id: 'chain',
    label: 'Blockchain',
    path: '/blockchain',
    canonicalUrl: 'https://explorer.oenexa.com',
    description: 'ONXC L1 Explorer & RPC Console',
  },
  {
    id: 'ai',
    label: 'OENXA AI',
    path: '/ai',
    canonicalUrl: 'https://ai.oenexa.com',
    description: 'Autonomous Software Engineering Studio',
  },
  {
    id: 'oengo',
    label: 'OENGO',
    path: '/oengo',
    canonicalUrl: 'https://app.oenexa.com/oengo',
    description: 'Decentralized Food Delivery & Commerce',
  },
  {
    id: 'security',
    label: 'Security & KYC',
    path: '/security',
    canonicalUrl: 'https://app.oenexa.com/security',
    description: 'Identity Sessions, Passkeys & Compliance Tier',
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    canonicalUrl: 'https://admin.oenexa.com',
    description: 'Platform Governance & Operations Console',
  },
  {
    id: 'docs',
    label: 'Docs',
    path: '/docs',
    canonicalUrl: 'https://docs.oenexa.com',
    description: 'Developer APIs & Technical Architecture',
  },
];
