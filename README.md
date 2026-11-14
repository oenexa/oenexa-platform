# OENEXA Platform (`oenexa-platform`)

> **Enterprise Platform Foundation & Shared Ecosystem Contracts**  
> Governed by the OENEXA Chief Technology Office & Enterprise Architecture Council.

## 1. Architectural Mandate
This repository contains **shared, dependency-safe ecosystem primitives only**.

### Permitted
- Design Tokens & CSS Variables (`@oenexa/design-tokens`)
- Canonical UI Shell Navigation & Metadata (`@oenexa/ui-shell`)
- In-Memory Zero-Storage Auth & OIDC SDK (`@oenexa/auth-sdk`)
- CNCF CloudEvents v1.0 Domain Event Schemas (`@oenexa/event-schemas`)
- RFC 7807 Problem Details & API Contracts (`@oenexa/api-contracts`)

### Strictly Forbidden
- ❌ No business logic
- ❌ No product-specific features
- ❌ No databases, migrations, or database queries
- ❌ No direct dependencies on product/domain repositories

Products depend on `oenexa-platform`. `oenexa-platform` never depends on products.

---

## 2. Packages

| Package | Purpose | Tests |
| :--- | :--- | :---: |
| [`@oenexa/design-tokens`](file:///C:/workspace/oenexarepo/oenexa-platform/packages/design-tokens) | Unified color palette, typography, elevation, dark/light CSS variables & Tailwind preset | Passed |
| [`@oenexa/ui-shell`](file:///C:/workspace/oenexarepo/oenexa-platform/packages/ui-shell) | Canonical portal navigation routes, product identifiers, and app shell metadata | Passed |
| [`@oenexa/auth-sdk`](file:///C:/workspace/oenexarepo/oenexa-platform/packages/auth-sdk) | Zero-localStorage session store, OIDC PKCE S256 URL builder, and token managers | Passed |
| [`@oenexa/event-schemas`](file:///C:/workspace/oenexarepo/oenexa-platform/packages/event-schemas) | CNCF CloudEvents v1.0 envelopes, event types, and payloads for Kafka event streaming | Passed |
| [`@oenexa/api-contracts`](file:///C:/workspace/oenexarepo/oenexa-platform/packages/api-contracts) | RFC 7807 Problem Details, API response envelopes, and canonical tracing headers | Passed |

---

## 3. Verification & Quality Gates
```bash
npm install
npm run typecheck
npm test
```
